
// Example of a Supabase Edge Function that can be created in the Supabase dashboard
// File name: send-reminder-email.ts

// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// You would need to set up email credentials in Supabase dashboard
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, etc.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, taskTitle, dueDate } = await req.json()

    if (!to || !subject || !taskTitle || !dueDate) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // In a real implementation, you would use a service like SendGrid, Resend, or SMTP
    // This is just a placeholder example
    console.log(`Sending email to ${to}:`)
    console.log(`Subject: ${subject}`)
    console.log(`Task: ${taskTitle}, Due: ${dueDate}`)

    // Example email HTML content
    const emailContent = `
      <h1>Task Reminder</h1>
      <p>This is a reminder that your task "${taskTitle}" is due in 12 hours (${dueDate}).</p>
      <p>Please make sure to complete it on time!</p>
    `

    // Mock successful email sending
    console.log('Email sent successfully (mock)')

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
