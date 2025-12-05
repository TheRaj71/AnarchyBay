import api, { saveSessionTokens, clearSessionTokens } from "../../lib/api/client.js";

export const signUpWithEmail = async (email, password) => {
  return api.post(
    "/api/auth/signup", 
    { email, password }, 
    { requireAuth: false }
  );
};

export const loginWithEmail = async (email, password) => {
  const data = await api.post(
    "/api/auth/login",
    { email, password },
    { requireAuth: false }
  );
  saveSessionTokens(data?.session);
  return data;
};

export const getCurrentUser = async () => {
  return api.get("/api/auth/me", { requireAuth: true });
};

export const logout = async () => {
  await api.post("/api/auth/logout", undefined, { requireAuth: false });
  clearSessionTokens();
};
