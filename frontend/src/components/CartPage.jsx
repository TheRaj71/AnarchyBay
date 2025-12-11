import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/use-auth';
import NavBar from './NavBar';
import { toast } from 'sonner';
import { getAccessToken } from '@/lib/api/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCartItems(data.items || []);
    } catch {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = getAccessToken();
      await fetch(`${API_URL}/api/cart/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(prev => prev.filter(item => item.product_id !== productId));
      toast.success('Removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckoutAndDownload = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setDownloading(true);
    try {
      const token = getAccessToken();

      for (const item of cartItems) {
        if (item.product?.files?.length > 0) {
          for (const file of item.product.files) {
            const response = await fetch(`${API_URL}/api/files/download/${file.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Download failed');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.original_filename || file.filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }
        }
      }

      toast.success('All files downloaded!');
    } catch {
      toast.error('Some downloads failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.product?.price || 0), 0);
  const currency = cartItems[0]?.product?.currency || 'INR';
  const currencySymbol = currency === 'INR' ? '₹' : '$';

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar />
        <main className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 border-3 border-black" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-black mb-8">
            Your <span className="text-[var(--pink-500)]">Cart</span>
          </h1>

          {cartItems.length === 0 ? (
            <div className="bg-white border-3 border-black shadow-[6px_6px_0px_var(--black)] p-12 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-black mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Browse our products and add items to your cart</p>
              <button
                onClick={() => navigate('/browse')}
                className="px-8 py-4 font-black uppercase bg-[var(--pink-500)] text-white border-3 border-black shadow-[4px_4px_0px_var(--black)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--black)] transition-all"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white border-3 border-black shadow-[4px_4px_0px_var(--black)] p-4 flex gap-4">
                    <Link to={`/product/${item.product_id}`} className="w-24 h-24 flex-shrink-0 bg-[var(--pink-50)] border-3 border-black overflow-hidden">
                      {item.product?.thumbnail_url ? (
                        <img src={item.product.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product_id}`} className="font-black text-lg hover:text-[var(--pink-500)] transition-colors line-clamp-1">
                        {item.product?.name || 'Product'}
                      </Link>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.product?.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-black text-xl text-[var(--pink-600)]">
                          {currencySymbol}{item.product?.price || 0}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="px-3 py-1 font-bold text-sm uppercase bg-white text-black border-2 border-black hover:bg-[var(--pink-100)] transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-[var(--yellow-400)] border-3 border-black shadow-[6px_6px_0px_var(--black)] p-6 sticky top-24">
                  <h2 className="font-black text-xl mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="truncate max-w-[150px]">{item.product?.name}</span>
                        <span className="font-bold">{currencySymbol}{item.product?.price || 0}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-3 border-black pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-lg">Total</span>
                      <span className="font-black text-2xl">{currencySymbol}{total}</span>
                    </div>
                    <p className="text-xs mt-1 text-gray-700">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
                  </div>

                  <button
                    onClick={handleCheckoutAndDownload}
                    disabled={downloading}
                    className="w-full py-4 font-black text-lg uppercase bg-[var(--pink-500)] text-white border-3 border-black shadow-[4px_4px_0px_var(--black)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--black)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_var(--black)] transition-all disabled:opacity-50"
                  >
                    {downloading ? (
                      <span className="flex items-center justify-center gap-3">
                        <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        Downloading...
                      </span>
                    ) : (
                      'Checkout & Download'
                    )}
                  </button>
                  
                  <p className="text-center text-xs mt-3 text-gray-700">
                    Instant access to all files
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
