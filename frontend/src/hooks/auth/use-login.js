import { useMutation } from "@tanstack/react-query";
import { loginWithEmail } from "../../services/auth/auth.service.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useLogin = () => {

  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: async ({ email, password }) => {
      return await loginWithEmail(email, password);
    },
    onSuccess: () => {
      toast.success("Login successful");
      navigate("/");
    },
  });
};

export default useLogin;
