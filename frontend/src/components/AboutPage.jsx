import NavBar from './NavBar.jsx';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main className="pt-20">
        
        {/* === Hero/Mission Section === */}
        <section className="py-20 md:py-32 bg-[var(--yellow-400)] border-b-3 border-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block px-4 py-2 bg-[var(--mint)] text-black border-3 border-black font-bold text-sm uppercase mb-6 shadow-[3px_3px_0px_var(--black)]">
              Our Story
            </span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Empowering India's Digital Creators
            </h1>
            <p className="text-2xl text-black max-w-4xl mx-auto leading-relaxed font-bold">
              AnarchyBay was founded on a simple principle: **Creators should get paid easily.** We cut through the red tape so you can focus on making amazing digital products.
            </p>
          </div>
        </section>

        {/* === Values Section === */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12">Our Core Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-[var(--pink-200)] border-3 border-black p-8 shadow-[6px_6px_0px_var(--black)]">
              <div className="text-5xl mb-4">🇮🇳</div>
              <h3 className="font-black text-2xl mb-3">Indian Focus</h3>
              <p className="text-gray-800">
                We are built from the ground up to support Indian creators, with native support for UPI and local banking.
              </p>
            </div>
            
            <div className="bg-[var(--mint)] border-3 border-black p-8 shadow-[6px_6px_0px_var(--black)]">
              <div className="text-5xl mb-4">⚡️</div>
              <h3 className="font-black text-2xl mb-3">Simplicity First</h3>
              <p className="text-gray-800">
                No complex forms, no hidden fees. We provide the simplest listing process available for digital goods.
              </p>
            </div>
            
            <div className="bg-[var(--yellow-100)] border-3 border-black p-8 shadow-[6px_6px_0px_var(--black)]">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="font-black text-2xl mb-3">Fair Earnings</h3>
              <p className="text-gray-800">
                We believe creators deserve the lion's share. Our commission structure is transparent and highly competitive.
              </p>
            </div>
          </div>
        </section>

        {/* === Founders/Team Placeholder === */}
        <section className="py-20 bg-[var(--pink-50)] border-y-3 border-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-4xl font-black mb-8">Meet the Team</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
              
              {/* Dummy Team Member Card */}
              <div className="bg-white border-3 border-black p-6 shadow-[4px_4px_0px_var(--black)]">
                <div className="w-24 h-24 bg-gray-300 mx-auto mb-4 border-2 border-black rounded-full"></div>
                <h4 className="font-black text-lg">Arjun K.</h4>
                <p className="text-sm text-[var(--pink-500)]">Founder & CEO</p>
              </div>

              <div className="bg-white border-3 border-black p-6 shadow-[4px_4px_0px_var(--black)]">
                <div className="w-24 h-24 bg-gray-300 mx-auto mb-4 border-2 border-black rounded-full"></div>
                <h4 className="font-black text-lg">Priya V.</h4>
                <p className="text-sm text-[var(--pink-500)]">Head of Product</p>
              </div>

              <div className="bg-white border-3 border-black p-6 shadow-[4px_4px_0px_var(--black)]">
                <div className="w-24 h-24 bg-gray-300 mx-auto mb-4 border-2 border-black rounded-full"></div>
                <h4 className="font-black text-lg">Rahul S.</h4>
                <p className="text-sm text-[var(--pink-500)]">Lead Engineer</p>
              </div>

              <div className="bg-white border-3 border-black p-6 shadow-[4px_4px_0px_var(--black)]">
                <div className="w-24 h-24 bg-gray-300 mx-auto mb-4 border-2 border-black rounded-full"></div>
                <h4 className="font-black text-lg">Sneha M.</h4>
                <p className="text-sm text-[var(--pink-500)]">Community Lead</p>
              </div>
              
            </div>
          </div>
        </section>
        
        {/* === Final CTA (Careers) === */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-4">Want to join the mission?</h2>
            <a 
              href="#" 
              className="inline-block px-8 py-4 text-lg font-black uppercase bg-[var(--pink-500)] text-white border-3 border-black shadow-[4px_4px_0px_var(--black)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--black)] transition-all"
            >
              See Open Roles →
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}