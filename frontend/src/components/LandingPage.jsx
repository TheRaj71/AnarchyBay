import React from "react";
import NavBar from "./NavBar.jsx";
import TrendingSlider from "./landing/TrendingSlider.jsx";
import { useState } from "react";
import LearnMorePage from "./LearnMorePage.jsx";


// BitShelf Landing Page — Single-file React component using Tailwind CSS
// Drop this file into your frontend (e.g. src/pages/LandingPage.jsx)
// Requires Tailwind CSS configured in the project.

export default function LandingPage() {
  const [showLearnMore, setShowLearnMore] = useState(false);
  if (showLearnMore) return <LearnMorePage />;
  return (
    <div className="min-h-screen bg-linear-to-b from-white via-slate-50 to-slate-100 text-slate-900">
      {/* Nav Bar */}
      <NavBar />

      {/* HERO */}
      <main className="pt-24">
        <section className="relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -left-32 w-96 h-96 bg-linear-to-br from-indigo-300 via-purple-300 to-pink-300 rounded-full opacity-30 blur-3xl transform rotate-45 animate-blob" />
          <div className="absolute -bottom-32 -right-40 w-md h-112 bg-linear-to-tr from-cyan-200 via-sky-200 to-indigo-200 rounded-full opacity-40 blur-3xl transform rotate-12 animate-blob animation-delay-2000" />

          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">Sell code, APIs and digital tools — <span className="text-indigo-600">built for developers</span>.</h1>
                <p className="text-slate-600 text-lg">BitShelf helps developers package and sell their code, templates, and APIs with instant delivery, license keys, and Indian payment support (UPI, Razorpay).</p>

                <div className="flex gap-4 items-center">
                  <a href="#products" className="inline-flex items-center gap-3 px-6 py-3 rounded-md bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700">Start Selling</a>
                  <a
                    onClick={() => setShowLearnMore(true)}
                    className="text-sm text-slate-600 hover:text-indigo-600 cursor-pointer"
                  >
                    Learn more →
                  </a>
                </div>

                <div className="mt-6 flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-3">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="react" className="w-6 h-6" />
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="node" className="w-6 h-6" />
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="pg" className="w-6 h-6" />
                  </div>
                  <div>Trusted by developers worldwide — seamless GitHub + payment integration.</div>
                </div>
              </div>

              {/* Right panel: mock marketplace preview */}
              <TrendingSlider />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard title="Instant Delivery" desc="Auto-generated download links & license keys. One-click updates." icon="🚀" />
            <FeatureCard title="Indian Payments" desc="UPI, Razorpay & INR pricing, GST-ready invoices." icon="💸" />
            <FeatureCard title="Developer Tools" desc="GitHub sync, versioning, API product support." icon="🛠️" />
          </div>
        </section>

        {/* PRODUCT SHOWCASE (horizontal scroll) */}
        <section id="products" className="py-10 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-2xl font-semibold mb-4">Trending Products</h3>
            <div className="overflow-x-auto -mx-6 py-4">
              <div className="flex gap-6 px-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="min-w-[18rem] bg-white rounded-xl p-5 shadow hover:shadow-lg transition">
                    <div className="h-36 bg-linear-to-br from-indigo-50 to-sky-50 rounded-md flex items-center justify-center"> <div className="text-4xl">📦</div> </div>
                    <div className="mt-4">
                      <div className="font-semibold">Product {i + 1}</div>
                      <div className="text-sm text-slate-500 mt-1">Short product description for developers and teams.</div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-indigo-600 font-semibold">₹{199 + i * 50}</div>
                        <button className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm">Buy</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="max-w-6xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-semibold mb-6">Pricing Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard title="Starter" price="Free" features={["Single product", "Community support", "Basic delivery"]} />
            <PricingCard title="Pro" price="₹499/mo" features={["Unlimited products", "Priority support", "Advanced analytics"]} highlight />
            <PricingCard title="Team" price="Contact" features={["Team seats", "Custom SLA", "Enterprise features"]} />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-12 bg-linear-to-b from-white to-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="text-2xl font-semibold mb-6">What Creators Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Testimonial name="Ankit" title="Fullstack Dev" text="Made my first sale in 24 hours — payouts were smooth and easy." />
              <Testimonial name="Rekha" title="UI Designer" text="The product pages look amazing and conversions improved." />
              <Testimonial name="Sahil" title="API Dev" text="License keys and API product support saved me so much time." />
            </div>
          </div>
        </section>

        {/* CTA FOOTER */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold">Ready to sell your first product?</h3>
            <p className="text-slate-600 mt-3">Sign up, upload your product, and start selling to developers across India and the world.</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <a href="#" className="px-6 py-3 rounded-md bg-indigo-600 text-white font-semibold">Get Started</a>
              <a href="#" className="px-6 py-3 rounded-md border border-slate-200 text-slate-700">Contact Sales</a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-slate-900 text-white py-10">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="font-bold text-lg">BitShelf</div>
              <div className="text-sm text-slate-400 mt-2">Sell your digital products to developers. Instant delivery, secure payments.</div>
            </div>

            <div>
              <div className="font-semibold">Company</div>
              <ul className="mt-3 text-sm text-slate-400 space-y-2">
                <li>About</li>
                <li>Careers</li>
                <li>Blog</li>
              </ul>
            </div>

            <div>
              <div className="font-semibold">Contact</div>
              <div className="text-sm text-slate-400 mt-3">hello@bitshelf.example</div>
            </div>
          </div>
        </footer>
      </main>

      {/* Small inline styles for simple animations */}
      <style>{`
        .animate-blob{ animation: blob 8s infinite; }
        .animation-delay-2000{ animation-delay: 2s; }
        @keyframes blob {
          0%{ transform: translate(0px, 0px) scale(1) }
          33%{ transform: translate(30px, -50px) scale(1.05) }
          66%{ transform: translate(-20px, 20px) scale(0.95) }
          100%{ transform: translate(0px, 0px) scale(1) }
        }
      `}</style>
    </div>
  );
}


/* --------------------- Helper components --------------------- */

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="text-3xl mb-3">{icon}</div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-slate-500 mt-2">{desc}</div>
    </div>
  );
}

function PricingCard({ title, price, features, highlight }) {
  return (
    <div className={`rounded-2xl p-6 ${highlight ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-slate-100'}`}>
      <div className="font-semibold text-lg">{title}</div>
      <div className="mt-2 text-2xl font-bold">{price}</div>
      <ul className={`mt-4 space-y-2 ${highlight ? 'text-indigo-100' : 'text-slate-600'}`}>
        {features.map((f, i) => <li key={i}>• {f}</li>)}
      </ul>
      <div className="mt-6">
        <button className={`${highlight ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'} px-4 py-2 rounded-md`}>Choose</button>
      </div>
    </div>
  );
}

function Testimonial({ name, title, text }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="text-slate-600">“{text}”</div>
      <div className="mt-4 font-semibold">{name}</div>
      <div className="text-sm text-slate-500">{title}</div>
    </div>
  );
}
