
import { supabase } from './supabase';

/**
 * Sends an email notification for a task due soon
 * Uses Supabase Edge Functions to handle the email sending
 */
export const sendTaskReminderEmail = async (
  userEmail: string, 
  taskTitle: string, 
  dueDate: string
): Promise<boolean> => {
  try {
    // Format the due date for display
    const formattedDueDate = new Date(dueDate).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Call the Supabase Edge Function (which needs to be created in the Supabase dashboard)
    const { error } = await supabase.functions.invoke('send-reminder-email', {
      body: {
        to: userEmail,
        subject: `Reminder: Task "${taskTitle}" is due in 12 hours`,
        taskTitle,
        dueDate: formattedDueDate
      }
    });

    if (error) {
      console.error('Error sending email notification:', error);
      return false;
    }

    console.log(`Reminder email sent to ${userEmail} for task "${taskTitle}"`);
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
};
