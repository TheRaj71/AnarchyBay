import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import useSignUp from "@/hooks/auth/use-signup";
import { supabase } from "@/lib/supabase";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oauthLoading, setOauthLoading] = useState(false);
  
  const { mutate: signup, isPending, error } = useSignUp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    signup({ name, email, password });
  };

  const handleOAuthSignUp = async (provider) => {
    setOauthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        toast.error(error.message);
      }
    } catch {
      toast.error("OAuth sign up failed. Please try again.");
    } finally {
      setOauthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="absolute inset-0 pattern-dots opacity-20" />
      
      <div className="absolute top-10 right-10 w-24 h-24 bg-[var(--yellow-400)] border-3 border-black rotate-12 hidden lg:block" />
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-[var(--pink-300)] border-3 border-black -rotate-6 hidden lg:block" />
      <div className="absolute top-1/3 left-20 w-16 h-16 bg-[var(--mint)] border-3 border-black rotate-45 hidden lg:block" />

      <div className="w-full max-w-md relative">
        <Link to="/" className="flex items-center gap-3 mb-8 justify-center group">
          <img 
            src="/favicon_io/android-chrome-192x192.png" 
            alt="AnarchyBay" 
            className="w-12 h-12 border-3 border-black group-hover:rotate-6 transition-transform"
          />
          <span className="font-black text-3xl">AnarchyBay</span>
        </Link>

        <div className="bg-white border-3 border-black shadow-[8px_8px_0px_var(--black)] p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black mb-2">Create Account</h1>
            <p className="text-gray-600">Start selling your digital products</p>
          </div>

          <div className="space-y-4 mb-6">
            <button
              type="button"
              onClick={() => handleOAuthSignUp("google")}
              disabled={oauthLoading}
              className="w-full py-4 font-bold flex items-center justify-center gap-3 bg-white border-3 border-black shadow-[4px_4px_0px_var(--black)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--black)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_var(--black)] transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignUp("github")}
              disabled={oauthLoading}
              className="w-full py-4 font-bold flex items-center justify-center gap-3 bg-black text-white border-3 border-black shadow-[4px_4px_0px_var(--pink-500)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--pink-500)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_var(--pink-500)] transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
              Sign up with GitHub
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-0.5 bg-black" />
            <span className="font-bold text-sm uppercase text-gray-500">Or</span>
            <div className="flex-1 h-0.5 bg-black" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-sm uppercase mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-5 py-4 font-medium bg-white border-3 border-black focus:outline-none focus:shadow-[4px_4px_0px_var(--black)] transition-all"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-sm uppercase mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-5 py-4 font-medium bg-white border-3 border-black focus:outline-none focus:shadow-[4px_4px_0px_var(--black)] transition-all"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-sm uppercase mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 font-medium bg-white border-3 border-black focus:outline-none focus:shadow-[4px_4px_0px_var(--black)] transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
            </div>

            {error && (
              <div className="p-4 bg-red-100 border-3 border-red-500 text-red-700 font-bold">
                {error.message || "Sign up failed. Please try again."}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 font-black text-lg uppercase bg-[var(--pink-500)] text-white border-3 border-black shadow-[4px_4px_0px_var(--black)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--black)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_var(--black)] transition-all disabled:opacity-50"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[var(--pink-600)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}