import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/auth/use-auth";
import { verifyPurchase, getPurchase } from "@/services/purchase.service";
import NavBar from "./NavBar";

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const purchaseId = searchParams.get("purchase_id");
  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!purchaseId) {
      setError("No purchase found");
      setLoading(false);
      return;
    }

    const verifyAndFetch = async () => {
      try {
        const result = await verifyPurchase(purchaseId, paymentId);
        
        if (result.purchase) {
          setPurchase(result.purchase);
        } else {
          const purchaseData = await getPurchase(purchaseId);
          setPurchase(purchaseData);
        }
      } catch (err) {
        console.error("Failed to verify purchase:", err);
        setError("Failed to verify payment");
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetch();
  }, [isAuthenticated, navigate, purchaseId, paymentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <div className="pt-24 flex flex-col items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-slate-600">Verifying your purchase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <main className="pt-24 pb-12 max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Something went wrong</h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <Link
              to="/library"
              className="inline-block px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition"
            >
              Check My Library
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="pt-24 pb-12 max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden text-center">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8">
            <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Payment Successful!</h1>
            <p className="text-white/90 mt-2">Thank you for your purchase</p>
          </div>

          <div className="p-8">
            {purchase ? (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {purchase.products?.name || "Your Product"}
                  </h3>
                  <p className="text-2xl font-bold text-violet-600">
                    ${parseFloat(purchase.amount || 0).toFixed(2)}
                  </p>
                  {purchase.status === "completed" && (
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      Ready to download
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    to={`/download/${purchase.id}`}
                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-pink-600 transition shadow-lg"
                  >
                    Download Your Files
                  </Link>
                  <Link
                    to="/library"
                    className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition"
                  >
                    View My Library
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-slate-600">
                  Your payment is being processed. Your files will be available shortly.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/library"
                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-500 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-pink-600 transition shadow-lg"
                  >
                    Go to My Library
                  </Link>
                  <Link
                    to="/dashboard"
                    className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            )}

            {purchaseId && (
              <p className="text-xs text-slate-400 mt-6">
                Purchase ID: {purchaseId}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}