import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "@/hooks/auth/use-login";
import NavBar from "@/components/NavBar";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <>
      <NavBar/>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      
      <div className="w-full max-w-6xl  bg-white rounded-lg shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left gradient panel */}
        <div className="relative hidden md:flex flex-col items-center justify-center p-12 bg-linear-to-br from-violet-600 via-violet-500 to-pink-500 text-white">
          {/* decorative floating circles */}
          <div className="absolute left-8 top-8 w-3 h-3 bg-white/30 rounded-full"></div>
          <div className="absolute right-16 top-24 w-4 h-4 bg-white/20 rounded-full"></div>
          <div className="absolute left-24 bottom-20 w-5 h-5 bg-white/15 rounded-full"></div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              {/* small icon */}
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 2v6M5 8l4 2 4-2 4 2 0 10H5z"/></svg>
            </div>
            <span className="text-xl font-semibold">BitShelf</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-center mb-4">
            Welcome Back to<br/>Your Creative Space
          </h1>

          <p className="max-w-sm text-center text-white/90 mt-2">
            Sign in to continue building amazing projects and bring your ideas to life.
          </p>
        </div>

        {/* Right form panel */}
        <div className="px-8 py-10 md:py-16 md:px-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Or{" "}
                <Link
                  to="/signup"
                  className="font-medium text-violet-600 hover:text-violet-500"
                >
                  create a new account
                </Link>
              </p>
            </div>

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-md bg-red-50 p-3">
                  <div className="text-sm text-red-800">
                    {error.message || "Failed to login. Please try again."}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-3 py-3 rounded-xl border border-slate-200 placeholder-slate-400 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="Email address"
                    disabled={isPending}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3 1.343 3 3v2H9v-2c0-1.657 1.343-3 3-3z"/><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M17 11V8a5 5 0 10-10 0v3"/></svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-3 py-3 rounded-xl border border-slate-200 placeholder-slate-400 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="Password"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-hidden
                  >
                    {/* eye icon (decorative) */}
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-slate-700">Remember me</span>
                </label>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-violet-600 hover:text-violet-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-linear-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    
    </>
    
  );
};

export default LoginPage;
