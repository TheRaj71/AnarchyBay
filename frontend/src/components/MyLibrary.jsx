import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/use-auth";
import NavBar from "./NavBar";
import { getAccessToken } from "@/lib/api/client";

export default function MyLibrary() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const token = getAccessToken();
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/purchases/my-purchases`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPurchases(data.purchases || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <span className="inline-block px-4 py-2 bg-[var(--mint)] border-3 border-black font-bold text-sm uppercase mb-4">
              My Library
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-2">
              Your <span className="text-[var(--pink-500)]">Purchases</span>
            </h1>
            <p className="text-xl text-gray-600">Access and download your purchased products.</p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white border-3 border-black shadow-[4px_4px_0px_var(--black)] animate-pulse">
                  <div className="aspect-video bg-gray-200 border-b-3 border-black" />
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-gray-200 w-3/4" />
                    <div className="h-4 bg-gray-200 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : purchases.length === 0 ? (
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_var(--black)] p-12 text-center">
              <div className="text-7xl mb-6">📚</div>
              <h2 className="text-3xl font-black mb-4">Your library is empty</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                Products you purchase will appear here. Browse the marketplace to find something awesome!
              </p>
              <button
                onClick={() => navigate("/browse")}
                className="px-8 py-4 font-black text-lg uppercase bg-[var(--pink-500)] text-white border-3 border-black shadow-[6px_6px_0px_var(--black)] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[9px_9px_0px_var(--black)] transition-all"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="bg-white border-3 border-black shadow-[4px_4px_0px_var(--black)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_var(--black)] transition-all"
                >
                  <div className="aspect-video bg-[var(--pink-50)] border-b-3 border-black flex items-center justify-center overflow-hidden">
                    {purchase.product?.thumbnail_url ? (
                      <img 
                        src={purchase.product.thumbnail_url} 
                        alt={purchase.product?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">📦</span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {purchase.product?.category?.slice(0, 2).map((cat, j) => (
                        <span key={j} className="px-3 py-1 text-xs font-bold uppercase bg-[var(--mint)] border-2 border-black">
                          {cat}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-black text-xl mb-2">{purchase.product?.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Purchased on {new Date(purchase.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/download/${purchase.id}`)}
                        className="flex-1 py-3 font-bold uppercase bg-[var(--pink-500)] text-white border-3 border-black shadow-[3px_3px_0px_var(--black)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--black)] transition-all"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => navigate(`/product/${purchase.product_id}`)}
                        className="py-3 px-4 font-bold uppercase border-3 border-black hover:bg-[var(--pink-50)] transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
