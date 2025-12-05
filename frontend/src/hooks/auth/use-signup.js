import { useMutation } from "@tanstack/react-query";
import { signUpWithEmail } from "../../services/auth/auth.service.js";
import { createUserProfile } from "../../services/auth/profile.service.js";
import { queryClient } from "../../lib/tanstack/client";
import { useNavigate } from "react-router-dom";
import { QUERY_KEYS } from "../../utils/constants.js";

const useSignUp = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ name, email, password, role = "customer", sellerCode }) => {
      const { user } = await signUpWithEmail(email, password);
      if (!user) throw new Error("Failed to sign up");
      await createUserProfile({ id: user.id, name, email, role, sellerCode });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOTAL_USERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
      navigate("/login");
    },
  });
};

export default useSignUp;
