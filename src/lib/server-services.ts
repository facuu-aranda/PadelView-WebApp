import { createClient } from '@supabase/supabase-js';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Server-side environment variables check
const supabaseUrl = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Supabase client instance for server-side queries.
 */
export const getSupabase = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are not set.');
  }
  const sanitizedUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').trim();
  return createClient(sanitizedUrl, supabaseServiceKey, {
    auth: {
      persistSession: false
    }
  });
};

/**
 * Generates a temporary Presigned URL for viewing/downloading an R2 video.
 */
export async function getSignedVideoUrl(
  videoKey: string, 
  filename: string,
  r2Config: { endpoint: string, accessKeyId: string, secretAccessKey: string, bucketName: string }
): Promise<string> {
  if (!r2Config.accessKeyId || !r2Config.secretAccessKey || !r2Config.endpoint) {
    throw new Error('Cloudflare R2 credentials are not set for this client.');
  }

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: r2Config.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: r2Config.accessKeyId,
      secretAccessKey: r2Config.secretAccessKey
    }
  });

  const command = new GetObjectCommand({
    Bucket: r2Config.bucketName,
    Key: videoKey,
    // Force browser to download with clean filename when user clicks download button
    ResponseContentDisposition: `attachment; filename="${filename}"`
  });

  // Expire URL in 2 hours (7200 seconds)
  const url = await getSignedUrl(s3Client, command, { expiresIn: 7200 });
  return url;
}
