import { useState } from "react";
import { Link } from "react-router-dom";
import useSignUp from "@/hooks/auth/use-signup";
import toast from "react-hot-toast";
import NavBar from "@/components/NavBar";


const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    sellerCode: "",
  });

  const { mutate: signUp, isPending, error } = useSignUp();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.role === "seller" && !formData.sellerCode) {
      toast.error("Seller code is required for seller accounts");
      return;
    }

    signUp({
      name: formData.name,
      email: formscreenData.email,
      password: formData.password,
      role: formData.role,
      sellerCode: formData.sellerCode || undefined,
    });
  };

  return (
    <div className=" bg-gray-100 flex my-20  items-center justify-center">
      <NavBar/>
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT PANEL — Gradient */}
        <div className="relative hidden md:flex flex-col items-center justify-center p-12 bg-linear-to-br from-violet-600 via-violet-500 to-pink-500 text-white">
          <div className="absolute left-8 top-8 w-3 h-3 bg-white/30 rounded-full"></div>
          <div className="absolute right-16 top-24 w-4 h-4 bg-white/20 rounded-full"></div>
          <div className="absolute left-24 bottom-20 w-5 h-5 bg-white/15 rounded-full"></div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" d="M12 2v6M5 8l4 2 4-2 4 2v10H5z" />
              </svg>
            </div>
            <span className="text-xl font-semibold">BitShelf</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-center mb-4">
            Create Your<br />New Account
          </h1>

          <p className="max-w-sm text-center text-white/90 mt-2">
            Join the platform and start building your creative projects today.
          </p>
        </div>

        {/* RIGHT PANEL — Form */}
        <div className="px-8 py-10 md:py-16 md:px-12 flex items-center justify-center">
          <div className="w-full max-w-md">

            <div className="text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-violet-600 hover:text-violet-500">
                  Sign in
                </Link>
              </p>
            </div>

            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-md bg-red-50 p-3">
                  <div className="text-sm text-red-800">
                    {error.message || "Failed to create account. Please try again."}
                  </div>
                </div>
              )}

              <div className="space-y-4">

                {/* Full Name */}
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  disabled={isPending}
                  className="block w-full px-3 py-3 rounded-xl border border-slate-200 placeholder-slate-400 text-slate-900 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />

                {/* Email */}
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  disabled={isPending}
                  className="block w-full px-3 py-3 rounded-xl border border-slate-200 placeholder-slate-400 text-slate-900 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />

                {/* Password */}
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password (min. 6 characters)"
                  disabled={isPending}
                  className="block w-full px-3 py-3 rounded-xl border border-slate-200 placeholder-slate-400 text-slate-900 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />

                {/* Confirm Password */}
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  disabled={isPending}
                  className="block w-full px-3 py-3 rounded-xl border border-slate-200 placeholder-slate-400 text-slate-900 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />

                {/* Role Selector */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Account Type
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={isPending}
                    className="block w-full px-3 py-3 rounded-xl border border-slate-200 text-slate-900 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  >
                    <option value="customer">Customer</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>

                {/* Seller Code Field */}
                {formData.role === "seller" && (
                  <div>
                    <input
                      id="sellerCode"
                      name="sellerCode"
                      type="text"
                      value={formData.sellerCode}
                      onChange={handleChange}
                      placeholder="Seller Code (Required for seller accounts)"
                      disabled={isPending}
                      className="block w-full px-3 py-3 rounded-xl border border-slate-200 placeholder-slate-400 text-slate-900 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Contact support to obtain a seller code
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-4 rounded-xl text-white text-sm font-semibold bg-linear-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? "Creating account..." : "Sign up"}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUpPage;
