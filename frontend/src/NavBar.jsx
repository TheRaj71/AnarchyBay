

function NavBar(){
    return (
        <>
        
        {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-40 backdrop-blur bg-white/60 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="rounded-md px-3 py-1 font-semibold text-indigo-600 bg-indigo-50">BitShelf</div>
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
                <a href="/" className="hover:text-indigo-600">Home</a>
                <a href="#features" className="hover:text-indigo-600">Features</a>
                <a href="#products" className="hover:text-indigo-600">Products</a>
                <a href="#pricing" className="hover:text-indigo-600">Pricing</a>
                <a href="#about" className="hover:text-indigo-600">About</a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <a href="#" className="hidden md:inline-block px-4 py-2 text-sm font-medium border rounded-md border-slate-200">Sign in</a>
              <a href="#" className="px-4 py-2 text-sm font-semibold rounded-md bg-indigo-600 text-white shadow hover:bg-indigo-700">Get Started</a>
            </div>
          </div>
        </div>
      </header>

        </>
    )
}

export default NavBar