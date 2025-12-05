import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/auth/auth.service.js";
import { getUserProfile } from "../../services/auth/profile.service.js";
import { QUERY_KEYS } from "../../utils/constants.js";

export const useAuth = () => {

  const { USER, CURRENT_USER } = QUERY_KEYS;

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: [CURRENT_USER],
    queryFn: getCurrentUser,
    retry: false,
  });

  const userId = user?.id;
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: [USER, userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });

  return {
    user,
    role: profile?.role || null,
    loading: userLoading || profileLoading,
    name: profile?.name || null,
  };
};



