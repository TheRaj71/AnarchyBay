// Updated import to reflect the new repository naming for clarity
import { createContact, getContacts } from '../repository/contact.repository.js'; 
import { sendAdminNotification, sendAutoReply, isMailerConfigured } from '../lib/mailer.js';

// Simple email validation regex (can be improved, but matches common JS expectations)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

export const submitContactController = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // --- Validation ---
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required fields.' });
    }
    
    // Add simple email format check
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }
    // --- End Validation ---

    const { data, error } = await createContact({ name, email, subject, message });
    
    // Check for DB errors (e.g., if the DB's CHECK constraint was violated)
    if (error) {
      console.error('Submission failed after validation:', error.message);
      // Use a generic error message for security unless error is safe to expose
      return res.status(500).json({ error: 'Failed to record message due to a database issue.' });
    }

    // --- Non-Fatal Email Logic ---
    // Try to send admin notification and confirmation email if mailer configured
    if (isMailerConfigured()) {
      // Use Promise.allSettled for parallel, non-blocking email attempts
      // and log errors without blocking the primary response.
      Promise.allSettled([
        sendAdminNotification({ name, email, subject, message }),
        sendAutoReply({ to: email, name }),
      ]).catch(e => console.warn('Non-fatal email sending error:', e));
    }
    // --- End Email Logic ---

    return res.status(201).json({ message: 'Message received successfully', data });
  } catch (err) {
    console.error('Error in submitContactController:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const listContactsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    // Ensure limit is reasonable (e.g., max 100)
    const safeLimit = Math.min(limit, 100); 
    
    const offset = (page - 1) * safeLimit;

    const { data, error, count } = await getContacts({ limit: safeLimit, offset });

    if (error) {
        // Logging the specific error is good for debugging
        console.error('Error fetching contacts list:', error.message); 
        return res.status(500).json({ error: 'Failed to retrieve contacts list.' });
    }

    // Calculate metadata for pagination
    const totalPages = count ? Math.ceil(count / safeLimit) : 0;
    
    return res.status(200).json({ 
        contacts: data, 
        total: count, 
        page: page,
        limit: safeLimit,
        totalPages: totalPages
    });
  } catch (err) {
    console.error('Error in listContactsController:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};