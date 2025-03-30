
/**
 * Example of a Supabase Edge Function that can be created in the Supabase dashboard
 * File name: send-reminder-email.ts
 * 
 * NOTE: This is just a reference example. In a real implementation, this code would 
 * be deployed to Supabase's Edge Functions, not included in your frontend build.
 */

// This is a TypeScript-compatible version of the Deno example
// In the actual Supabase Edge Function, you would use:
// import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

type Request = {
  method: string;
  json: () => Promise<any>;
};

type Response = {
  headers: Record<string, string>;
  status: number;
};

// Mock serve function for the example
const serve = (handler: (req: Request) => Promise<Response>) => {
  console.log('This is a reference implementation only');
  return handler;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return {
      headers: corsHeaders,
      status: 200,
      body: 'ok'
    };
  }

  try {
    const { to, subject, taskTitle, dueDate } = await req.json();

    if (!to || !subject || !taskTitle || !dueDate) {
      return {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // In a real implementation, you would use a service like SendGrid, Resend, or SMTP
    // This is just a placeholder example
    console.log(`Sending email to ${to}:`);
    console.log(`Subject: ${subject}`);
    console.log(`Task: ${taskTitle}, Due: ${dueDate}`);

    // Example email HTML content
    const emailContent = `
      <h1>Task Reminder</h1>
      <p>This is a reminder that your task "${taskTitle}" is due in 12 hours (${dueDate}).</p>
      <p>Please make sure to complete it on time!</p>
    `;

    // Mock successful email sending
    console.log('Email sent successfully (mock)');

    return {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error processing request:', error);
    
    return {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
      body: JSON.stringify({ error: 'Failed to send email' })
    };
  }
};

// This simulates the serve function wrapping the handler
serve(handler);

// Export the handler for reference
export default handler;
