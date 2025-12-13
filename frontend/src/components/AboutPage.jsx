import NavBar from './NavBar';

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-pink-50">
      <NavBar />
      
      <div className="pt-20 px-4 sm:px-6 md:px-8 pb-8 md:pb-12 mx-2 sm:mx-4 md:mx-8 my-4 md:my-8 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="excerpt max-w-4xl mx-auto">
          <div className="title__container text-center mb-12">
            <h1 className="font-['Brush_Script_MT',cursive] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal mt-6 mb-6 text-pink-500">
              Anarchy Bay
            </h1>
            <img 
              className="flower mx-auto my-6 h-32 sm:h-40 md:h-48 object-contain"
              src="https://raw.githubusercontent.com/melipi/img-repo/main/flower-silhouette.png"
              alt="flower silhouette"
            />
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-wide text-black">A marketplace for everyone</h2>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            <p className="text-justify leading-relaxed text-base md:text-lg p-6 bg-pink-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Welcome to AnarchyBay, where freedom meets commerce. In a world dominated by gatekeepers and intermediaries, we believe in something different. AnarchyBay is a decentralized marketplace built on the principles of freedom, transparency, and community.
            </p>

            <p className="text-justify leading-relaxed text-base md:text-lg p-6 bg-pink-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Here, anyone can buy and sell without barriers, without excessive fees, and without compromising their autonomy. Our platform was born from a simple idea: commerce should be free and accessible to all.
            </p>

            <p className="text-justify leading-relaxed text-base md:text-lg p-6 bg-pink-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Whether you're a creator selling digital art, a craftsperson offering handmade goods, or an entrepreneur launching your first product, AnarchyBay provides the tools and freedom you need to thrive. We don't believe in restrictive policies or hidden agendas—just honest, peer-to-peer exchange.
            </p>

            <p className="text-justify leading-relaxed text-base md:text-lg p-6 bg-pink-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              What makes us different? We embrace the chaos and beauty of an open marketplace. No algorithmic manipulation. No preferential treatment. No corporate overlords deciding what you can see, buy, or sell. Just real people connecting with real products and services.
            </p>

            <p className="text-justify leading-relaxed text-base md:text-lg p-6 bg-pink-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Our community is our strength. From tech enthusiasts to vintage collectors, from indie artists to sustainable living advocates—AnarchyBay brings together diverse voices and visions. We celebrate individuality and encourage authentic expression.
            </p>

            <p className="text-justify leading-relaxed text-base md:text-lg p-6 bg-pink-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Security and privacy are paramount. While we champion freedom, we also protect our users with robust encryption, transparent policies, and user-controlled data. You decide what to share, when to share it, and with whom.
            </p>

            <p className="text-justify leading-relaxed text-base md:text-lg p-6 bg-pink-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Join us in reimagining what a marketplace can be. Buy freely. Sell fearlessly. Connect authentically. This is AnarchyBay—where your commerce, your rules. Together, we're building an economy that puts power back in the hands of individuals, one transaction at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}