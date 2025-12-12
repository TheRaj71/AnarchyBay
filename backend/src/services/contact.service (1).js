import { createContact, getContacts } from '../repositories/contact.repository.js';

export const submitContact = async (payload) => {
  return await createContact(payload);
};

export const listContacts = async (opts) => {
  return await getContacts(opts);
};
