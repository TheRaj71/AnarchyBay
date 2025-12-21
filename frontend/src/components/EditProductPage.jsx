import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/auth/use-auth";
import NavBar from "./NavBar";
import { toast } from "sonner";
import { getAccessToken } from "@/lib/api/client";
import { 
  ArrowLeft, Palette, FileText, ShoppingBag, 
  Tag, Save, X, Check, Zap, Globe
} from "lucide-react";

const CATEGORIES = ["Design", "Code", "Templates", "E-commerce", "Icons", "Photography", "Productivity", "Education"];
const SHORT_DESC_LIMIT = 200;

const PAGE_COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Cream", value: "#fffbeb" },
  { name: "Pink", value: "#fdf2f8" },
  { name: "Mint", value: "#ecfdf5" },
  { name: "Sky", value: "#f0f9ff" },
  { name: "Lavender", value: "#faf5ff" },
  { name: "Gray", value: "#f9fafb" },
  { name: "Black", value: "#0a0a0a" },
];

const ACCENT_COLORS = [
  { name: "Yellow", value: "#ffde59" },
  { name: "Pink", value: "#ec4899" },
  { name: "Mint", value: "#10b981" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
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
            toast.error("Unauthorized access");
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
        toast.error("Failed to sync product data");
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
      toast.error("Required fields missing");
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
        toast.success("Registry updated successfully");
        navigate(`/product/${productId}`);
      } else {
        const data = await response.json();
        toast.error(data.error?.message || "Failed to update asset");
      }
    } catch (err) {
      toast.error("Network synchronization failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar />
        <main className="pt-32 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Accessing Registry...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans">
      <NavBar />

      <main className="pt-32 pb-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <header className="mb-16">
          <button 
            onClick={() => navigate(`/product/${productId}`)}
            className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#0071e3] transition-colors group"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            Back to Asset
          </button>
          <h1 className="text-5xl font-black tracking-tight mb-2">Edit Asset</h1>
          <p className="text-xl text-gray-500 font-medium">Update specification for mapping: <span className="text-[#0071e3] underline underline-offset-4 font-bold">{form.name}</span></p>
        </header>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            
            {/* Identity Node */}
            <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-50 text-[#0071e3] rounded-2xl flex items-center justify-center">
                        <FileText size={24} />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Technical Data</h2>
                </div>

                <div className="space-y-8">
                    <InputField 
                        label="Asset Name" 
                        value={form.name} 
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Specification name..."
                        required
                    />

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-xs font-black uppercase tracking-widest text-[#1d1d1f]">Short Tagline</label>
                            <span className="text-[10px] font-bold text-gray-400">{form.short_description.length}/{SHORT_DESC_LIMIT}</span>
                        </div>
                        <input
                            type="text"
                            value={form.short_description}
                            onChange={e => setForm(p => ({ ...p, short_description: e.target.value.slice(0, SHORT_DESC_LIMIT) }))}
                            className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-[#1d1d1f] mb-4">Detailed Description</label>
                        <textarea
                            value={form.long_description}
                            onChange={e => setForm(p => ({ ...p, long_description: e.target.value }))}
                            rows={10}
                            className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] font-medium outline-none focus:ring-4 focus:ring-blue-50 transition-all resize-none"
                        />
                    </div>
                </div>
            </section>

            {/* Price and Taxonomy */}
            <div className="grid md:grid-cols-2 gap-8">
                <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                            <ShoppingBag size={20} />
                        </div>
                        <h3 className="text-xl font-bold">Economic Node</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Unit</label>
                            <select
                                value={form.currency}
                                onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                            </select>
                        </div>
                        <InputField 
                            type="number"
                            label="Price" 
                            value={form.price} 
                            onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                            required
                        />
                    </div>
                </section>

                <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                            <Tag size={20} />
                        </div>
                        <h3 className="text-xl font-bold">Taxonomy</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => toggleCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    form.categories.includes(cat)
                                        ? "bg-[#1d1d1f] text-white"
                                        : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            <div className="sticky top-32 space-y-8">
                
                {/* Visual Customization */}
                <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <Palette size={20} className="text-pink-500" />
                        <h3 className="text-lg font-black tracking-tight">Theme Registry</h3>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-4">Base Color</label>
                            <div className="flex flex-wrap gap-2">
                                {PAGE_COLORS.map(color => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setForm(p => ({ ...p, page_color: color.value }))}
                                        className={`w-8 h-8 rounded-full border border-gray-100 transition-all ${form.page_color === color.value ? "ring-2 ring-blue-500 ring-offset-2 scale-110" : "hover:scale-110"}`}
                                        style={{ backgroundColor: color.value }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-4">Button Theme</label>
                            <div className="flex flex-wrap gap-2">
                                {ACCENT_COLORS.map(color => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setForm(p => ({ ...p, button_color: color.value }))}
                                        className={`w-8 h-8 rounded-full border border-gray-100 transition-all ${form.button_color === color.value ? "ring-2 ring-black ring-offset-2 scale-110" : "hover:scale-110"}`}
                                        style={{ backgroundColor: color.value }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final Actions */}
                <div className="space-y-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-5 bg-[#0071e3] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all shadow-xl shadow-blue-100 disabled:opacity-50"
                    >
                        {saving ? <Zap className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Specification
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/product/${productId}`)}
                        className="w-full py-4 bg-gray-50 border border-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all"
                    >
                        Abort Changes
                    </button>
                </div>

                <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-3">
                    <Globe size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest leading-relaxed">Changes will propagate across all registry nodes instantly upon save.</p>
                </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, required, type = "text" }) {
    return (
        <div>
            <label className="block text-xs font-black uppercase tracking-widest text-[#1d1d1f] mb-4">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all text-xl"
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}