import { handleSupabaseError, supabase } from "../lib/supabase.js";

// Extract and verify Supabase access token, attach user to req
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return handleSupabaseError(res, error);
    }

    const user = data?.user;
    if (!user?.id) {
      return res.status(401).json({ error: "Invalid user token" });
    }

    req.user = { id: user.id }; // attach minimal identity
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
