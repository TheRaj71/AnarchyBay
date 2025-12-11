import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/auth/use-auth";
import NavBar from "./NavBar";
import { toast } from "sonner";
import { getAccessToken } from "@/lib/api/client";

const CATEGORIES = ["Design", "Code", "Templates", "E-commerce", "Icons", "Photography", "Productivity", "Education"];
const SHORT_DESC_LIMIT = 200;
const LONG_DESC_LIMIT = 5000;

const PAGE_COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Cream", value: "#fffbeb" },
  { name: "Pink", value: "#fdf2f8" },
  { name: "Mint", value: "#ecfdf5" },
  { name: "Sky", value: "#f0f9ff" },
  { name: "Lavender", value: "#faf5ff" },
  { name: "Peach", value: "#fff7ed" },
  { name: "Gray", value: "#f9fafb" },
  { name: "Black", value: "#0a0a0a" },
  { name: "Dark Blue", value: "#1e3a5f" },
];

const ACCENT_COLORS = [
  { name: "Yellow", value: "#ffde59" },
  { name: "Pink", value: "#ec4899" },
  { name: "Mint", value: "#10b981" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Orange", value: "#f97316" },
  { name: "Red", value: "#ef4444" },
  { name: "Teal", value: "#14b8a6" },
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function EditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    short_description: "",
    long_description: "",
    price: "",
    currency: "INR",
    categories: [],
    tags: "",
    page_color: "#ffffff",
    accent_color: "#ffde59",
    button_color: "#ec4899",
    text_color: "#000000",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        if (data.product) {
          const p = data.product;
          if (p.creator_id !== user?.id) {
            toast.error("You can only edit your own products");
            navigate(`/product/${productId}`);
            return;
          }
          setForm({
            name: p.name || "",
            short_description: p.short_description || "",
            long_description: p.long_description || "",
            price: p.price?.toString() || "",
            currency: p.currency || "INR",
            categories: p.category || [],
            tags: (p.tags || []).join(", "),
            page_color: p.page_color || "#ffffff",
            accent_color: p.accent_color || "#ffde59",
            button_color: p.button_color || "#ec4899",
            text_color: p.text_color || "#000000",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load product");
        setLoading(false);
      });
  }, [productId, isAuthenticated, navigate, user?.id]);

  const toggleCategory = (cat) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.price || form.categories.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);

    try {
      const token = getAccessToken();
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: form.name,
          description: form.short_description,
          short_description: form.short_description,
          long_description: form.long_description,
          price: parseFloat(form.price),
          currency: form.currency,
          category: form.categories,
          tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
          page_color: form.page_color,
          accent_color: form.accent_color,
          button_color: form.button_color,
          text_color: form.text_color,
        }),
      });

      if (response.ok) {
        toast.success("Product updated successfully!");
        navigate(`/product/${productId}`);
      } else {
        const data = await response.json();
        toast.error(data.error?.message || data.error || "Failed to update product");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar />
        <main className="pt-24 flex items-center justify-center">
          <svg className="w-12 h-12 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <button 
              onClick={() => navigate(`/product/${productId}`)}
              className="flex items-center gap-2 mb-4 px-4 py-2 text-sm font-bold uppercase border-3 border-black bg-white hover:bg-[var(--yellow-400)] shadow-[3px_3px_0px_var(--black)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--black)] transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to product
            </button>
            <h1 className="font-display text-4xl mb-2">Edit Product</h1>
            <p className="text-gray-500">Update your product details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_var(--black)] p-6">
              <h2 className="font-bold text-xl uppercase mb-4">Product Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold uppercase text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 border-3 border-black focus:outline-none focus:shadow-[3px_3px_0px_var(--black)]"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-bold uppercase text-gray-700">Short Description</label>
                    <span className={`text-xs font-bold ${form.short_description.length > SHORT_DESC_LIMIT * 0.9 ? "text-pink-500" : "text-gray-400"}`}>
                      {form.short_description.length}/{SHORT_DESC_LIMIT}
                    </span>
                  </div>
                  <textarea
                    value={form.short_description}
                    onChange={e => setForm(p => ({ ...p, short_description: e.target.value.slice(0, SHORT_DESC_LIMIT) }))}
                    rows={2}
                    className="w-full px-4 py-3 border-3 border-black focus:outline-none focus:shadow-[3px_3px_0px_var(--black)] resize-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-bold uppercase text-gray-700">Long Description</label>
                    <span className={`text-xs font-bold ${form.long_description.length > LONG_DESC_LIMIT * 0.9 ? "text-pink-500" : "text-gray-400"}`}>
                      {form.long_description.length}/{LONG_DESC_LIMIT}
                    </span>
                  </div>
                  <textarea
                    value={form.long_description}
                    onChange={e => setForm(p => ({ ...p, long_description: e.target.value.slice(0, LONG_DESC_LIMIT) }))}
                    rows={8}
                    className="w-full px-4 py-3 border-3 border-black focus:outline-none focus:shadow-[3px_3px_0px_var(--black)] resize-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold uppercase text-gray-700 mb-1">Price *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-600">
                        {form.currency === "INR" ? "₹" : "$"}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={form.price}
                        onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 font-bold text-lg border-3 border-black focus:outline-none focus:shadow-[3px_3px_0px_var(--black)]"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase text-gray-700 mb-1">Currency</label>
                    <select
                      value={form.currency}
                      onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}
                      className="w-full px-4 py-3 border-3 border-black focus:outline-none cursor-pointer font-bold"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-gray-700 mb-2">Categories *</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-4 py-2 text-sm font-bold uppercase border-3 border-black transition-all ${
                          form.categories.includes(cat)
                            ? "bg-[var(--yellow-400)] shadow-[3px_3px_0px_var(--black)]"
                            : "bg-white hover:bg-[var(--mint)]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-gray-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                    className="w-full px-4 py-3 border-3 border-black focus:outline-none focus:shadow-[3px_3px_0px_var(--black)]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_var(--black)] p-6">
              <h2 className="font-bold text-xl uppercase mb-4">Page Customization</h2>
              <p className="text-sm text-gray-500 mb-6">Customize the colors of your product page elements</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase text-gray-700 mb-3">Page Background Color</label>
                  <div className="flex flex-wrap gap-3">
                    {PAGE_COLORS.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, page_color: color.value }))}
                        className={`w-10 h-10 border-3 transition-all ${
                          form.page_color === color.value 
                            ? "border-[var(--pink-500)] shadow-[3px_3px_0px_var(--black)] scale-110" 
                            : "border-black hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                    <div className="relative">
                      <input
                        type="color"
                        value={form.page_color}
                        onChange={e => setForm(p => ({ ...p, page_color: e.target.value }))}
                        className="absolute inset-0 w-10 h-10 opacity-0 cursor-pointer"
                      />
                      <div 
                        className="w-10 h-10 border-3 border-dashed border-gray-400 flex items-center justify-center hover:border-black transition-colors"
                        style={{ backgroundColor: !PAGE_COLORS.find(c => c.value === form.page_color) ? form.page_color : 'transparent' }}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-gray-700 mb-3">Accent Color (Price Section)</label>
                  <div className="flex flex-wrap gap-3">
                    {ACCENT_COLORS.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, accent_color: color.value }))}
                        className={`w-10 h-10 border-3 transition-all ${
                          form.accent_color === color.value 
                            ? "border-[var(--pink-500)] shadow-[3px_3px_0px_var(--black)] scale-110" 
                            : "border-black hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                    <div className="relative">
                      <input
                        type="color"
                        value={form.accent_color}
                        onChange={e => setForm(p => ({ ...p, accent_color: e.target.value }))}
                        className="absolute inset-0 w-10 h-10 opacity-0 cursor-pointer"
                      />
                      <div 
                        className="w-10 h-10 border-3 border-dashed border-gray-400 flex items-center justify-center hover:border-black transition-colors"
                        style={{ backgroundColor: !ACCENT_COLORS.find(c => c.value === form.accent_color) ? form.accent_color : 'transparent' }}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-gray-700 mb-3">Button Color</label>
                  <div className="flex flex-wrap gap-3">
                    {ACCENT_COLORS.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, button_color: color.value }))}
                        className={`w-10 h-10 border-3 transition-all ${
                          form.button_color === color.value 
                            ? "border-[var(--pink-500)] shadow-[3px_3px_0px_var(--black)] scale-110" 
                            : "border-black hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                    <div className="relative">
                      <input
                        type="color"
                        value={form.button_color}
                        onChange={e => setForm(p => ({ ...p, button_color: e.target.value }))}
                        className="absolute inset-0 w-10 h-10 opacity-0 cursor-pointer"
                      />
                      <div 
                        className="w-10 h-10 border-3 border-dashed border-gray-400 flex items-center justify-center hover:border-black transition-colors"
                        style={{ backgroundColor: !ACCENT_COLORS.find(c => c.value === form.button_color) ? form.button_color : 'transparent' }}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-gray-700 mb-3">Text Color</label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { name: "Black", value: "#000000" },
                      { name: "Dark Gray", value: "#374151" },
                      { name: "Gray", value: "#6b7280" },
                      { name: "White", value: "#ffffff" },
                      { name: "Cream", value: "#fef3c7" },
                    ].map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, text_color: color.value }))}
                        className={`w-10 h-10 border-3 transition-all ${
                          form.text_color === color.value 
                            ? "border-[var(--pink-500)] shadow-[3px_3px_0px_var(--black)] scale-110" 
                            : "border-black hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                    <div className="relative">
                      <input
                        type="color"
                        value={form.text_color}
                        onChange={e => setForm(p => ({ ...p, text_color: e.target.value }))}
                        className="absolute inset-0 w-10 h-10 opacity-0 cursor-pointer"
                      />
                      <div 
                        className="w-10 h-10 border-3 border-dashed border-gray-400 flex items-center justify-center hover:border-black transition-colors"
                        style={{ backgroundColor: form.text_color !== "#000000" && form.text_color !== "#374151" && form.text_color !== "#6b7280" && form.text_color !== "#ffffff" && form.text_color !== "#fef3c7" ? form.text_color : 'transparent' }}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 border-3 border-black" style={{ backgroundColor: form.page_color }}>
                <p className="text-lg font-bold mb-2" style={{ color: form.text_color }}>Preview</p>
                <p className="text-sm mb-4" style={{ color: form.text_color, opacity: 0.8 }}>This is how your text will look</p>
                <div className="inline-block px-6 py-3 border-3 border-black font-bold" style={{ backgroundColor: form.accent_color }}>
                  Price Section
                </div>
                <div className="inline-block ml-3 px-6 py-3 border-3 border-black font-bold text-white" style={{ backgroundColor: form.button_color }}>
                  Buy Button
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(`/product/${productId}`)}
                className="flex-1 py-4 font-bold uppercase border-3 border-black bg-white hover:bg-gray-100 shadow-[4px_4px_0px_var(--black)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--black)] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-4 font-bold uppercase border-3 border-black bg-[var(--yellow-400)] shadow-[4px_4px_0px_var(--black)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--black)] transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}