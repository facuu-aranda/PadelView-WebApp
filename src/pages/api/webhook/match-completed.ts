import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse Supabase Webhook payload
    // Supabase DB webhooks send a JSON payload with schema:
    // { type: 'UPDATE', table: 'matches', record: { ... }, old_record: { ... }, ... }
    const payload = await request.json();
    
    const { record, type, table } = payload;

    if (table !== 'matches') {
      return new Response(JSON.stringify({ message: 'Ignored: Table is not matches.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Trigger only when status changes/becomes DONE
    if (record && record.status === 'DONE') {
      const { player_name, player_phone, id } = record;
      
      // Resolve base public URL dynamically from request url
      // e.g. https://padelview-sportivo.vercel.app/api/... -> https://padelview-sportivo.vercel.app
      const baseUrl = new URL(request.url).origin;
      const matchUrl = `${baseUrl}/partido/${id}`;
      
      const message = `¡Hola ${player_name}! 🎾 Tu partido en Sportivo Belgrano ya está disponible para ver y descargar. Accedé mediante este enlace: ${matchUrl}`;
      
      // WhatsApp API configuration via env vars
      const provider = process.env.WHATSAPP_PROVIDER; // 'TWILIO' | 'GREEN_API'
      console.log(`Webhook triggered for match ${id}. Selected WhatsApp provider: ${provider || 'none'}`);

      if (provider === 'GREEN_API') {
        const instanceId = process.env.GREEN_API_INSTANCE_ID;
        const token = process.env.GREEN_API_TOKEN;
        
        if (instanceId && token) {
          // Format phone number: remove non-digits (e.g. +54 9 3564 12-3456 -> 5493564123456)
          const cleanPhone = player_phone.replace(/\D/g, '');
          const url = `https://api.green-api.com/waInstance${instanceId}/sendMessage/${token}`;
          
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chatId: `${cleanPhone}@c.us`,
              message: message
            })
          });
          
          if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Green API request failed (${response.status}): ${errBody}`);
          }
          console.log(`Notification sent via Green API for match ${id}`);
        } else {
          console.warn('Green API config is incomplete (Instance ID or Token missing).');
        }
      } else if (provider === 'TWILIO') {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromPhone = process.env.TWILIO_FROM_NUMBER || 'whatsapp:+14155238886'; // Default sandbox
        
        if (accountSid && authToken) {
          const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
          const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              To: `whatsapp:${player_phone}`,
              From: fromPhone,
              Body: message
            })
          });
          
          if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Twilio API request failed (${response.status}): ${errBody}`);
          }
          console.log(`Notification sent via Twilio for match ${id}`);
        } else {
          console.warn('Twilio config is incomplete (Account SID or Auth Token missing).');
        }
      } else {
        // Log message for local testing/monitoring
        console.log('--- WHATSAPP NOTIFICATION MOCK ---');
        console.log(`To: ${player_phone} (${player_name})`);
        console.log(`Content: ${message}`);
        console.log('----------------------------------');
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
