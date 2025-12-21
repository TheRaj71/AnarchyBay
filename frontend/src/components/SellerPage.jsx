import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import NavBar from "./NavBar";

export default function SellerPage() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/profile/user/${sellerId}`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/profile/user/${sellerId}/products`).then(res => res.json()),
    ]).then(([profileData, productsData]) => {
      setSeller(profileData.profile);
      setProducts(productsData.products || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [sellerId]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return (b.rating_avg || 0) - (a.rating_avg || 0);
    if (sortBy === "popularity") return (b.sales_count || 0) - (a.sales_count || 0);
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <NavBar />
        <main className="pt-24 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="animate-pulse">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-24 h-24 rounded-full bg-gray-200" />
                <div className="space-y-3">
                  <div className="h-8 w-48 bg-gray-200" />
                  <div className="h-4 w-32 bg-gray-200" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border-3 border-black h-80" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-white text-black">
        <NavBar />
        <main className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_var(--black)] p-12">
              <div className="text-6xl mb-4">👤</div>
              <h1 className="text-3xl font-black mb-4 uppercase">Seller Not Found</h1>
              <p className="text-gray-600 mb-8 font-bold">This seller profile doesn't exist.</p>
              <button
                onClick={() => navigate("/browse")}
                className="px-8 py-4 font-black uppercase bg-[var(--pink-500)] text-white border-3 border-black shadow-[4px_4px_0px_var(--black)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--black)] transition-all"
              >
                Browse Products
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const displayName = seller.display_name || seller.name || "Anonymous";

  return (
    <div className="min-h-screen bg-white text-black">
      <NavBar />

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 font-black uppercase hover:text-[var(--pink-600)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_var(--black)] p-8 mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-[var(--pink-200)] border-4 border-black flex items-center justify-center text-4xl font-black overflow-hidden shadow-[4px_4px_0px_black]">
                {seller.profile_image_url ? (
                  <img src={seller.profile_image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">{displayName}</h1>
                {seller.username && (
                  <p className="text-[var(--pink-600)] font-black text-lg">@{seller.username}</p>
                )}
                {seller.bio && (
                  <p className="text-gray-700 mt-4 max-w-2xl font-bold leading-tight">{seller.bio}</p>
                )}
                <div className="flex flex-wrap items-center gap-6 mt-6">
                  <span className="flex items-center gap-2 font-black uppercase text-sm bg-blue-100 border-2 border-black px-3 py-1 shadow-[2px_2px_0px_black]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    {products.length} Items
                  </span>
                  <span className="flex items-center gap-2 font-black uppercase text-sm bg-green-100 border-2 border-black px-3 py-1 shadow-[2px_2px_0px_black]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Est. {new Date(seller.created_at).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Vault of {displayName}</h2>
            <div className="flex items-center gap-4">
               <span className="font-black uppercase text-xs">Sort By:</span>
               <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-4 py-2 font-black uppercase bg-white border-3 border-black shadow-[4px_4px_0px_var(--black)] cursor-pointer focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[5px_5px_0px_black] outline-none"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-low">Cheap</option>
                <option value="price-high">Premium</option>
                <option value="rating">Top Rated</option>
                <option value="popularity">Hot</option>
              </select>
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_var(--black)] p-16 text-center">
              <div className="text-7xl mb-6">🏜️</div>
              <h3 className="font-black text-3xl mb-2 uppercase">The Vault is Empty</h3>
              <p className="text-gray-600 font-bold">This creator hasn't dropped any assets yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ProductCard({ product, navigate }) {
  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white border-3 border-black shadow-[6px_6px_0px_var(--black)] cursor-pointer hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_var(--black)] transition-all group"
    >
      <div className="aspect-square bg-[var(--pink-50)] border-b-3 border-black flex items-center justify-center overflow-hidden relative">
        {product.thumbnail_url ? (
          <img 
            src={product.thumbnail_url} 
            alt={product.name} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <span className="text-7xl">📦</span>
        )}
        <div className="absolute top-4 right-4 bg-white border-2 border-black px-3 py-1 font-black shadow-[3px_3px_0px_black]">
          {product.currency === 'INR' ? '₹' : '$'}{product.price}
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {product.category?.slice(0, 2).map((cat, j) => (
            <span key={j} className="px-3 py-1 text-[10px] font-black uppercase bg-[var(--mint-200)] border-2 border-black shadow-[2px_2px_0px_black]">
              {cat}
            </span>
          ))}
        </div>
        <h3 className="font-black text-2xl mb-2 uppercase tracking-tighter group-hover:text-[var(--pink-600)] transition-colors">{product.name}</h3>
        <p className="text-sm text-gray-700 font-bold line-clamp-2 mb-6 h-10 leading-tight">{product.description}</p>
        <div className="flex items-center justify-between pt-4 border-t-3 border-black">
          <div className="flex flex-col">
            {product.rating_count > 0 && (
              <div className="flex items-center gap-1 text-sm font-black uppercase">
                <svg className="w-4 h-4 fill-yellow-400 stroke-black stroke-2" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                {product.rating_avg?.toFixed(1)}
              </div>
            )}
            <span className="text-[10px] font-black uppercase text-gray-500">{product.sales_count || 0} Sales</span>
          </div>
          <button className="px-6 py-2 font-black uppercase bg-[var(--pink-500)] text-white border-3 border-black shadow-[4px_4px_0px_black] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0px_black] transition-all">
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
}
