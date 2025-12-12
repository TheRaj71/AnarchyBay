import { supabase } from '../lib/supabase.js';

// Function to create a new contact message in the database.
export const createContact = async ({ name, email, subject, message }) => {
  // Ensure subject is null if empty, matching database schema intention.
  const payload = {
    name,
    email,
    subject: subject || null,
    message,
  };

  // Using .select() with .single() is correct for returning the newly created record.
  const { data, error } = await supabase.from('contacts').insert(payload).select().single();
  
  // Return early if there's a specific database constraint error (e.g., email format check).
  if (error) {
    console.error('Database error creating contact:', error);
  }
  return { data, error };
};

// Function to fetch a list of contacts with pagination.
export const getContacts = async (opts = {}) => {
  // Using 50 as default limit aligns with listContactsController
  const { limit = 50, offset = 0 } = opts; 

  const { data, error, count } = await supabase
    .from('contacts')
    .select('*', { count: 'estimated' })
    .order('created_at', { ascending: false })
    // Range is inclusive-inclusive in Supabase/PostgREST
    .range(offset, offset + limit - 1);

  // Return early if there's a database error.
  if (error) {
    console.error('Database error fetching contacts:', error);
  }
  return { data, error, count };
};