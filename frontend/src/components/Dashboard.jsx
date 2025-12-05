import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/use-auth";
import NavBar from "./NavBar";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }
  const isSeller = user?.role === "seller";


  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      
      <main className="pt-24">
        {/* Welcome Section */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                Welcome, {user?.name || "User"}! 👋
              </h1>
              <p className="text-lg text-muted-foreground">
                {isSeller 
                  ? "Manage your products, track sales, and grow your business on BitShelf."
                  : "Explore amazing digital products from creators worldwide."}
              </p>
            </div>

            {/* Profile card (small) */}
            <div className="ml-6 bg-card border border-border rounded-2xl p-4 w-64 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-xl">{(user?.name || "U").charAt(0)}</div>
                <div>
                  <div className="font-semibold">{user?.name || "Your Name"}</div>
                  <div className="text-muted-foreground text-xs">{user?.email || "—"}</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs text-muted-foreground">Role</div>
                <div className="font-medium">{user?.role || "customer"}</div>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => navigate('/profile')} className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm">Edit Profile</button>
                <button onClick={() => navigate('/settings')} className="px-3 py-1 rounded-md border border-border text-sm">Settings</button>
              </div>
            </div>
          </div>
          {/* Role Badge */}
          <div className="mb-6">
            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isSeller 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-foreground"
            }`}>
              {isSeller ? "👨‍💼 Seller Account" : "👤 Customer Account"}
            </span>
          </div>

          {isSeller ? (
            <>
              {/* Seller Dashboard */}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-linear-to-r from-blue-500 to-purple-600 border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-2">📦</div>
              <div className="text-4xl font-bold text-white mb-2">0</div>
              <div className="text-sm text-white/80">Products Listed</div>
            </div>

            <div className="bg-linear-to-r from-green-500 to-teal-600 border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-2">💰</div>
              <div className="text-4xl font-bold text-white mb-2">$0</div>
              <div className="text-sm text-white/80">Total Revenue</div>
            </div>

            <div className="bg-linear-to-r from-orange-500 to-red-600 border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-2">📈</div>
              <div className="text-4xl font-bold text-white mb-2">0</div>
              <div className="text-sm text-white/80">Sales This Month</div>
            </div>
          </div>

              {/* Seller Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate("/products/new")}
              className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
            >
              ➕ Create New Product
            </button>

            <button
              onClick={() => navigate("/products")}
              className="bg-card border border-border px-8 py-4 rounded-2xl font-semibold hover:bg-secondary hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              📋 View All Products
            </button>
          </div>
              </>
          ) : 
          (
            <>
              {/* Customer Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-card border border-border rounded-2xl p-6 hover-lift">
                  <div className="text-4xl font-bold text-primary mb-2">0</div>
                  <div className="text-sm text-muted-foreground">Products Purchased</div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 hover-lift">
                  <div className="text-4xl font-bold text-primary mb-2">$0</div>
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                </div>
              </div>

              {/* Customer Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => navigate("/explore")}
                  className="bg-linear-to-r from-indigo-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  🔍 Explore Products
                </button>

                <button
                  onClick={() => navigate("/purchases")}
                  className="bg-card border border-border px-8 py-4 rounded-2xl font-semibold hover:bg-secondary hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  📦 My Purchases
                </button>
              </div>
            </>
          )}
        </section>

        {/* Activity Section */}
        <section className="max-w-6xl mx-auto px-6 py-12 border-t border-border">
          <h2 className="text-2xl font-bold mb-6">{isSeller ? "Recent Sales" : "My Library"}</h2>
          <div className="bg-linear-to-r from-gray-100 to-gray-200 border border-border rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-6xl mb-4">{isSeller ? "📊" : "📚"}</div>
            <p className="text-muted-foreground">
              {isSeller
                ? "No sales yet. Create your first product to get started!"
                : "No purchases yet. Explore amazing products now!"}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
