import { createClient } from '@supabase/supabase-js';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Server-side environment variables check
const supabaseUrl = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const r2Endpoint = process.env.R2_ENDPOINT;
const r2BucketName = process.env.R2_BUCKET_NAME || 'padelview-matches';

/**
 * Supabase client instance for server-side queries.
 */
export const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) are not set.');
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
};

/**
 * Generates a temporary Presigned URL for viewing/downloading an R2 video.
 */
export async function getSignedVideoUrl(videoKey: string, filename: string): Promise<string> {
  if (!r2AccessKeyId || !r2SecretAccessKey || !r2Endpoint) {
    throw new Error('Cloudflare R2 credentials (R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT) are not set.');
  }

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: r2Endpoint,
    credentials: {
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey
    }
  });

  const command = new GetObjectCommand({
    Bucket: r2BucketName,
    Key: videoKey,
    // Force browser to download with clean filename when user clicks download button
    ResponseContentDisposition: `attachment; filename="${filename}"`
  });

  // Expire URL in 2 hours (7200 seconds)
  const url = await getSignedUrl(s3Client, command, { expiresIn: 7200 });
  return url;
}
