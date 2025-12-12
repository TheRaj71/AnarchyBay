import { useState } from 'react';
import { useContact } from '../hooks/use-contact.js';
import { toast } from 'sonner';
import NavBar from './NavBar.jsx';

export default function ContactPage() {
  const { submit, isLoading } = useContact();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submit(form);
      toast.success('Message sent successfully! We will reply soon 🎉');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="pt-20">
        
        {/* === Hero Section (Themed Header) === */}
        <section className="relative py-16 md:py-24 overflow-hidden bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
            
            {/* Header Text */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-[var(--pink-500)] text-white border-3 border-black font-bold text-sm uppercase mb-6 shadow-[3px_3px_0px_var(--black)]">
                Get in Touch
              </span>
              <h1 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-6">
                We'd love to hear from you
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Have a question about AnarchyBay? Need support? Want to collaborate? 
                <span className="font-bold"> Drop us a line and we'll get back to you as fast as possible.</span>
              </p>
            </div>

            {/* Value Proposition Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="bg-[var(--yellow-400)] border-3 border-black p-6 shadow-[4px_4px_0px_var(--black)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--black)] transition-all">
                <div className="text-4xl mb-3">💬</div>
                <h3 className="font-black text-lg mb-2">Quick Response</h3>
                <p className="text-sm">We reply to all messages within 24 hours</p>
              </div>

              <div className="bg-[var(--mint)] border-3 border-black p-6 shadow-[4px_4px_0px_var(--black)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--black)] transition-all">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-black text-lg mb-2">Always Here</h3>
                <p className="text-sm">Our support team is available to help you</p>
              </div>

              <div className="bg-[var(--pink-200)] border-3 border-black p-6 shadow-[4px_4px_0px_var(--black)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--black)] transition-all">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="font-black text-lg mb-2">Human Touch</h3>
                <p className="text-sm">Real people, real solutions, not bots</p>
              </div>
            </div>
          </div>
        </section>

        {/* === Contact Form & Info Cards Section === */}
        <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* 1. Contact Form */}
            <div>
              <div className="bg-white border-3 border-black shadow-[8px_8px_0px_var(--black)] p-8">
                <h2 className="text-3xl font-black mb-6">Send us a message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-black uppercase mb-2">Your Name</label>
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      required 
                      placeholder="e.g. Arjun Kumar"
                      className="w-full p-4 border-3 border-black font-bold focus:outline-none focus:shadow-[0_0_0_3px_var(--pink-200)]" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black uppercase mb-2">Email Address</label>
                    <input 
                      name="email" 
                      type="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      required 
                      placeholder="your@email.com"
                      className="w-full p-4 border-3 border-black font-bold focus:outline-none focus:shadow-[0_0_0_3px_var(--pink-200)]" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black uppercase mb-2">Subject (Optional)</label>
                    <input 
                      name="subject" 
                      value={form.subject} 
                      onChange={handleChange} 
                      placeholder="What's this about?"
                      className="w-full p-4 border-3 border-black font-bold focus:outline-none focus:shadow-[0_0_0_3px_var(--yellow-200)]" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black uppercase mb-2">Your Message</label>
                    <textarea 
                      name="message" 
                      value={form.message} 
                      onChange={handleChange} 
                      required 
                      rows={6}
                      placeholder="Tell us what's on your mind..."
                      className="w-full p-4 border-3 border-black font-bold focus:outline-none focus:shadow-[0_0_0_3px_var(--mint-200)] resize-none" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full px-8 py-4 text-lg font-black uppercase bg-[var(--pink-500)] text-white border-3 border-black shadow-[4px_4px_0px_var(--black)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--black)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_var(--black)] transition-all disabled:opacity-70"
                  >
                    {isLoading ? '✉️ Sending...' : '✉️ Send Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* 2. Info Cards */}
            <div className="space-y-6">
              <div className="bg-[var(--pink-100)] border-3 border-black p-6 shadow-[4px_4px_0px_var(--black)]">
                <h3 className="font-black text-lg mb-2 flex items-center gap-2">
                  <span>📧</span> Email Support
                </h3>
                <p className="text-gray-700 font-bold mb-2">support@anarchybay.local</p>
                <p className="text-sm text-gray-600">Usually replies within a few hours</p>
              </div>

              <div className="bg-[var(--yellow-100)] border-3 border-black p-6 shadow-[4px_4px_0px_var(--black)]">
                <h3 className="font-black text-lg mb-2 flex items-center gap-2">
                  <span>💬</span> Social Media
                </h3>
                <div className="flex gap-3 mb-3">
                  <a href="#" className="px-3 py-2 text-xs font-bold uppercase bg-white border-2 border-black hover:shadow-[2px_2px_0px_var(--black)] transition-all">Twitter</a>
                  <a href="#" className="px-3 py-2 text-xs font-bold uppercase bg-white border-2 border-black hover:shadow-[2px_2px_0px_var(--black)] transition-all">Discord</a>
                </div>
                <p className="text-sm text-gray-600">Follow us for updates & community</p>
              </div>

              <div className="bg-[var(--mint-100)] border-3 border-black p-6 shadow-[4px_4px_0px_var(--black)]">
                <h3 className="font-black text-lg mb-2 flex items-center gap-2">
                  <span>📚</span> Help Center
                </h3>
                <a href="#" className="text-sm font-bold text-[var(--pink-600)] hover:underline mb-2 block">Browse FAQs →</a>
                <p className="text-sm text-gray-600">Find answers to common questions</p>
              </div>

              <div className="bg-white border-3 border-black p-6 shadow-[4px_4px_0px_var(--black)]">
                <h3 className="font-black text-lg mb-4">Response Time</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Email:</span>
                    <span className="px-3 py-1 bg-[var(--green-200)] border-2 border-black text-xs font-bold">24h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Discord:</span>
                    <span className="px-3 py-1 bg-[var(--yellow-200)] border-2 border-black text-xs font-bold">1-4h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === FAQ Section === */}
        <section className="py-20 bg-[var(--pink-50)] border-y-3 border-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-[var(--pink-500)] text-white border-3 border-black font-bold text-sm uppercase mb-4">FAQ</span>
              <h2 className="text-4xl font-black">Frequently Asked Questions</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { q: 'How long does it take to get a response?', a: 'We typically respond to all messages within 24 hours. Urgent issues on Discord may get faster replies.' },
                { q: 'What if I have a technical issue?', a: 'Email us with details and we\'ll investigate. Include your order ID if it\'s purchase-related.' },
                { q: 'Can I report a bug or security issue?', a: 'Yes! Please email us with details. Security issues should be marked as URGENT.' },
                { q: 'Do you have a refund policy?', a: 'Check our Help Center for detailed refund terms. Most digital products cannot be refunded.' },
              ].map((item, i) => (
                <div key={i} className="bg-white border-3 border-black p-6 shadow-[4px_4px_0px_var(--black)] hover:shadow-[6px_6px_0px_var(--black)] transition-all">
                  <h3 className="font-black text-lg mb-2">{item.q}</h3>
                  <p className="text-gray-700">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === CTA Section (Call to Action) === */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto bg-[var(--yellow-400)] border-3 border-black p-8 md:p-12 shadow-[8px_8px_0px_var(--black)]">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Didn't find what you need?</h2>
              <p className="text-lg mb-6 font-bold">Check our Help Center for more resources and documentation.</p>
              
              {/* THE REQUESTED STYLED BUTTON */}
              <a 
                href="/help-center" 
                className="inline-block px-8 py-4 text-lg font-black uppercase bg-[var(--pink-500)] text-white border-3 border-black shadow-[4px_4px_0px_var(--black)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--black)] transition-all"
              >
                Visit Help Center →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
}


function Footer() {
  return (
    <footer className="bg-black text-white py-16 border-t-3 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/favicon_io/android-chrome-192x192.png"
                alt="AnarchyBay Logo"
                className="w-12 h-12 border-3 border-white"
              />
              <span className="font-display text-2xl">AnarchyBay</span>
            </div>
            <p className="text-gray-400">
              The simplest way to sell digital products in India. UPI payments, instant delivery.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: [
                { name: "Features", href: "#" },
                { name: "Pricing", href: "#" },
                { name: "API", href: "#" } // Convert to object
              ]
            },
            {
              title: "Company",
              links: [
                { name: "About", href: "/about" }, // Add /about route
                { name: "Blog", href: "#" },
                { name: "Careers", href: "#" } // Convert to object
              ]
            },
            {
              title: "Support",
              links: [
                { name: "Help Center", href: "/help-center" },
                { name: "Contact", href: "/contact" },
                { name: "Terms", href: "/term" }
              ]
            },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="font-black text-sm uppercase mb-4 text-[var(--yellow-400)]">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-[var(--pink-400)] transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">© 2025 AnarchyBay. Made with 💖 in India.</div>
          <div className="flex gap-4">
            {["Twitter", "GitHub", "Discord"].map((social, i) => (
              <a key={i} href="#" className="px-4 py-2 text-sm font-bold uppercase border-2 border-gray-700 hover:border-[var(--pink-500)] hover:text-[var(--pink-400)] transition-all">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}