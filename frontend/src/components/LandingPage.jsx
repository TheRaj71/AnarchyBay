import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/use-auth";
import "@/styles/home.css"; // animations like .animate-float, .animate-blob stored here
import NavBar from "../components/NavBar";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleProtectedAction = () => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  };

  const goToDashboard = () => {
    if (isAuthenticated) navigate("/dashboard");
    else navigate("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-secondary/20 to-secondary/40 text-foreground">
      <NavBar onProtectedClick={handleProtectedAction} />

      <main className="pt-24">
        <HeroSection
          onGetStarted={handleProtectedAction}
          isAuthenticated={isAuthenticated}
          user={user}
          onGoToDashboard={goToDashboard}
        />
        <FeaturesSection />
        <ProductShowcase onBuy={handleProtectedAction} />
        <PricingSection onChoose={handleProtectedAction} />
        <TestimonialsSection />
        <CTASection onGetStarted={handleProtectedAction} />
        <Footer />
      </main>
    </div>
  );
}

/* --------------------- Hero Section --------------------- */
function HeroSection({ onGetStarted, isAuthenticated, user, onGoToDashboard }) {
  return (
    <section className="relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-32 w-96 h-96 bg-linear-to-br from-primary/30 via-accent/30 to-pink-500/30 rounded-full opacity-30 blur-3xl animate-blob" />
      <div className="absolute -bottom-32 -right-40 w-md h-112 bg-linear-to-tr from-cyan-500/20 via-sky-500/20 to-primary/20 rounded-full opacity-40 blur-3xl animate-blob animation-delay-2000" />

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left text */}
          <div className="space-y-6 fade-in-up">
            {isAuthenticated ? (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                  Welcome back, {user?.name || "Developer"}! 👋
                </h1>

                <p className="text-muted-foreground text-lg">
                  {user?.role === "seller"
                    ? "Manage your products, track sales, and grow your business on BitShelf."
                    : "Explore amazing digital products from creators worldwide."}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={onGoToDashboard}
                    className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition btn-pulse hover-lift"
                  >
                    Go to Dashboard
                  </button>

                  <a
                    href="#features"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    Explore →
                  </a>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                  Sell code, APIs and digital tools —{" "}
                  <span className="text-gradient">built for developers</span>.
                </h1>

                <p className="text-muted-foreground text-lg">
                  BitShelf helps developers package and sell their code, templates,
                  and APIs with instant delivery, license keys, and Indian payments.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={onGetStarted}
                    className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition btn-pulse hover-lift"
                  >
                    Start Selling
                  </button>

                  <a
                    href="#features"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                  >
                    Learn more →
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Right demo box */}
          <div className="relative fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xl hover-lift">

              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>

              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4 shimmer" />
                <div className="h-4 bg-muted rounded w-1/2 shimmer" />

                <div className="h-32 bg-linear-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                  <span className="text-4xl">🚀</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <div className="h-8 bg-primary/20 rounded flex-1" />
                  <div className="h-8 bg-accent/20 rounded flex-1" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------- Features Section --------------------- */
function FeaturesSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-12" ref={ref}>
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${visible ? "stagger-children" : ""}`}>
        <FeatureCard title="Instant Delivery" desc="Auto-generated download links & license keys." icon="🚀" />
        <FeatureCard title="Indian Payments" desc="UPI, Razorpay & INR billing support." icon="💸" />
        <FeatureCard title="Developer Tools" desc="GitHub sync, versioning, API products." icon="🛠️" />
      </div>
    </section>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="bg-card rounded-2xl p-6 card-interactive">
      <div className="text-3xl mb-3">{icon}</div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground mt-2">{desc}</div>
    </div>
  );
}

/* --------------------- Product Showcase --------------------- */
function ProductShowcase({ onBuy }) {
  return (
    <section id="products" className="py-10 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-2xl font-semibold mb-4">Trending Products</h3>

        <div className="overflow-x-auto -mx-6 py-4 product-scroll">
          <div className="flex gap-6 px-6 stagger-children">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="min-w-[18rem] bg-card rounded-xl p-5 card-interactive">
                <div className="h-36 bg-linear-to-br from-primary/10 to-accent/10 rounded-md flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>

                <div className="mt-4">
                  <div className="font-semibold">Product {i + 1}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Short product description for developers & teams.
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-primary font-semibold">₹{199 + i * 50}</div>

                    <button
                      onClick={onBuy}
                      className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90 transition btn-pulse"
                    >
                      Buy
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

/* --------------------- Pricing Section --------------------- */
function PricingSection({ onChoose }) {
  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-12">
      <h3 className="text-2xl font-semibold mb-6">Pricing Plans</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <PricingCard
          title="Starter"
          price="Free"
          features={["Single product", "Community support", "Basic delivery"]}
          onChoose={onChoose}
        />

        <PricingCard
          title="Pro"
          price="₹499/mo"
          highlight
          features={["Unlimited products", "Priority support", "Analytics"]}
          onChoose={onChoose}
        />

        <PricingCard
          title="Team"
          price="Contact"
          features={["Team seats", "Custom SLA", "Enterprise features"]}
          onChoose={onChoose}
        />

      </div>
    </section>
  );
}

function PricingCard({ title, price, features, highlight, onChoose }) {
  return (
    <div
      className={`rounded-2xl p-6 hover-lift ${
        highlight
          ? "bg-primary text-primary-foreground shadow-xl shadow-primary/30"
          : "bg-card border border-border"
      }`}
    >
      <div className="font-semibold text-lg">{title}</div>
      <div className="text-2xl font-bold mt-1">{price}</div>

      <ul className={`mt-4 space-y-2 ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {features.map((f, i) => (
          <li key={i}>• {f}</li>
        ))}
      </ul>

      <button
        onClick={onChoose}
        className={`mt-6 px-4 py-2 rounded-md transition ${
          highlight
            ? "bg-background text-primary hover:bg-background/90"
            : "bg-primary text-primary-foreground hover:opacity-90"
        }`}
      >
        Choose
      </button>
    </div>
  );
}

/* --------------------- Testimonials --------------------- */
function TestimonialsSection() {
  return (
    <section className="py-12 bg-linear-to-b from-background to-secondary/30">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-2xl font-semibold mb-6">What Creators Say</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Testimonial name="Ankit" title="Fullstack Dev" text="Made my first sale in 24 hours — payouts were smooth and easy." />
          <Testimonial name="Rekha" title="UI Designer" text="The product pages look amazing and conversions improved." />
          <Testimonial name="Sahil" title="API Dev" text="License keys and API support saved me so much time." />
        </div>
      </div>
    </section>
  );
}

function Testimonial({ name, title, text }) {
  return (
    <div className="bg-card p-6 rounded-2xl card-interactive">
      <div className="text-muted-foreground">"{text}"</div>
      <div className="mt-4 font-semibold">{name}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
}

/* --------------------- CTA Section --------------------- */
function CTASection({ onGetStarted }) {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold">Ready to sell your first product?</h3>

        <p className="text-muted-foreground mt-3">
          Sign up and start selling to developers worldwide.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-lg btn-pulse hover-lift"
          >
            Get Started
          </button>

          <button
            onClick={onGetStarted}
            className="px-6 py-3 rounded-lg border border-border hover:bg-secondary transition"
          >
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
}

/* --------------------- Footer --------------------- */
function Footer() {
  return (
    <footer className="bg-card border-t border-border py-10 bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div>
          <div className="font-bold text-lg">BitShelf</div>
          <div className="text-sm text-muted-foreground mt-2">
            Sell your digital products to developers. Instant delivery & secure payments.
          </div>
        </div>

        <div>
          <div className="font-semibold">Company</div>
          <ul className="mt-3 text-sm space-y-2 text-muted-foreground">
            <li className="hover:text-primary transition cursor-pointer">About</li>
            <li className="hover:text-primary transition cursor-pointer">Careers</li>
            <li className="hover:text-primary transition cursor-pointer">Blog</li>
          </ul>
        </div>

        <div>
          <div className="font-semibold">Contact</div>
          <div className="text-sm text-muted-foreground mt-3">
            hello@bitshelf.example
          </div>
        </div>

      </div>
    </footer>
  );
}
