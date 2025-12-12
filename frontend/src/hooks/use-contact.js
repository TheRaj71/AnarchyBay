import { useMutation } from '@tanstack/react-query';
import { submitContact } from '../services/contact.service.js';

export const useContact = () => {
  const mutation = useMutation({
    mutationFn: (payload) => submitContact(payload),
  });

  const submit = async (payload) => {
    return mutation.mutateAsync(payload);
  };

  return {
    submit,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
};
