import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search01Icon, InformationCircleIcon } from "hugeicons-react";
import HelpDocs from "./HelpDocs";

const CATEGORIES = ["Design", "Code", "Templates", "E-commerce", "Icons", "Photography", "Productivity"];

const BANGS = [
  { bang: "!c", name: "Category", description: "Search in category", examples: ["!c design", "!c code"] },
  { bang: "!p", name: "Price", description: "Filter by max price", examples: ["!p 500", "!p 1000"] },
  { bang: "!s", name: "Seller", description: "Search sellers", examples: ["!s john", "!s studio"] },
  { bang: "!new", name: "New", description: "Show newest products", examples: ["!new templates"] },
  { bang: "!top", name: "Top Rated", description: "Show top rated", examples: ["!top", "!top code"] },
];

const initialState = { query: "", results: [], loading: false, selectedIndex: 0, showBangs: false };

export default function SpotlightSearch({ isOpen, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const [state, setState] = useState(initialState);
  const [showHelp, setShowHelp] = useState(false);
  const { query, results, loading, selectedIndex, showBangs } = state;

  const parseBangs = useCallback((q) => {
    const parsed = { query: q, category: null, maxPrice: null, seller: false, sort: null };
    
    const categoryMatch = q.match(/!c\s+(\w+)/i);
    if (categoryMatch) {
      parsed.category = categoryMatch[1];
      parsed.query = q.replace(/!c\s+\w+/i, "").trim();
    }
    
    const priceMatch = q.match(/!p\s+(\d+)/i);
    if (priceMatch) {
      parsed.maxPrice = parseInt(priceMatch[1]);
      parsed.query = q.replace(/!p\s+\d+/i, "").trim();
    }
    
    if (q.includes("!s ")) {
      parsed.seller = true;
      parsed.query = q.replace(/!s\s+/i, "").trim();
    }
    
    if (q.includes("!new")) {
      parsed.sort = "newest";
      parsed.query = q.replace(/!new/i, "").trim();
    }
    
    if (q.includes("!top")) {
      parsed.sort = "rating";
      parsed.query = q.replace(/!top/i, "").trim();
    }
    
    return parsed;
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  // Handle opening - focus and reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setState(initialState);
      const timer = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else document.dispatchEvent(new CustomEvent("open-spotlight"));
      }
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!query.trim()) {
      setState(s => ({ ...s, results: [], showBangs: false }));
      return;
    }

    if (query === "!" || (query.startsWith("!") && !query.includes(" "))) {
      setState(s => ({ ...s, showBangs: true, results: [] }));
      return;
    }

    setState(s => ({ ...s, showBangs: false }));

    const parsed = parseBangs(query);
    const timer = setTimeout(async () => {
      setState(s => ({ ...s, loading: true }));
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        
        if (parsed.seller) {
          const res = await fetch(`${API_URL}/api/profile/search?q=${encodeURIComponent(parsed.query)}`);
          const data = await res.json();
          setState(s => ({
            ...s,
            loading: false,
            results: (data.profiles || []).slice(0, 5).map(p => ({
              type: "seller",
              id: p.id,
              name: p.display_name || p.name,
              description: p.bio || "Creator",
              image: p.profile_image_url,
            })),
          }));
        } else {
          let url = `${API_URL}/api/products/list?search=${encodeURIComponent(parsed.query)}`;
          if (parsed.category) url += `&category=${encodeURIComponent(parsed.category)}`;
          if (parsed.maxPrice) url += `&maxPrice=${parsed.maxPrice}`;
          if (parsed.sort) url += `&sort=${parsed.sort}`;
          
          const res = await fetch(url);
          const data = await res.json();
          setState(s => ({
            ...s,
            loading: false,
            results: (data.products || []).slice(0, 6).map(p => ({
              type: "product",
              id: p.id,
              name: p.name,
              description: p.description?.slice(0, 80) || "",
              price: p.price,
              currency: p.currency,
              category: p.category?.[0],
              image: p.thumbnail_url,
            })),
          }));
        }
      } catch {
        setState(s => ({ ...s, loading: false, results: [] }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, parseBangs]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleKeyDown = (e) => {
    const items = showBangs ? BANGS : results;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setState(s => ({ ...s, selectedIndex: Math.min(s.selectedIndex + 1, items.length - 1) }));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setState(s => ({ ...s, selectedIndex: Math.max(s.selectedIndex - 1, 0) }));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showBangs && BANGS[selectedIndex]) {
        setState(s => ({ ...s, query: BANGS[selectedIndex].bang + " ", showBangs: false }));
      } else if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (query.trim()) {
        const parsed = parseBangs(query);
        let url = `/browse?search=${encodeURIComponent(parsed.query)}`;
        if (parsed.category) url += `&category=${encodeURIComponent(parsed.category)}`;
        navigate(url);
        onClose();
      }
    }
  };

  const handleSelect = (item) => {
    if (item.type === "seller") {
      navigate(`/seller/${item.id}`);
    } else {
      navigate(`/product/${item.id}`);
    }
    onClose();
  };

  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selected = resultsRef.current.children[selectedIndex];
      selected?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />
        
        <div 
          className="relative w-full max-w-2xl mx-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden animate-spotlight-in"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center px-5 py-4">
            <Search01Icon size={22} className="text-gray-400 mr-3" strokeWidth={2} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setState(s => ({ ...s, query: e.target.value, selectedIndex: 0 }))}
              onKeyDown={handleKeyDown}
              placeholder="Spotlight Search"
              className="flex-1 text-lg font-medium bg-transparent outline-none placeholder:text-gray-400"
            />
            <div className="flex items-center gap-2 ml-3">
              <button
                onClick={() => setShowHelp(true)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <InformationCircleIcon size={18} className="text-gray-600" strokeWidth={2.5} />
              </button>
              <kbd className="hidden sm:flex items-center px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded">
                ESC
              </kbd>
            </div>
          </div>

          {showBangs && (
            <div className="max-h-80 overflow-y-auto border-t border-gray-200" ref={resultsRef}>
              <div className="px-4 py-2 text-xs font-semibold uppercase text-gray-500 bg-gray-50">
                Search Bangs
              </div>
              {BANGS.map((bang, i) => (
                <button
                  key={bang.bang}
                  onClick={() => { setState(s => ({ ...s, query: bang.bang + " ", showBangs: false })); inputRef.current?.focus(); }}
                  className={`w-full px-5 py-3 flex items-start gap-4 text-left transition-colors ${
                    i === selectedIndex ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="px-2 py-1 text-sm font-bold bg-blue-500 text-white rounded">
                    {bang.bang}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold">{bang.name}</div>
                    <div className="text-sm text-gray-500">{bang.description}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {bang.examples.join(" • ")}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!showBangs && query && (
            <div className="max-h-96 overflow-y-auto border-t border-gray-200" ref={resultsRef}>
              {loading ? (
                <div className="px-4 py-12 text-center">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto" />
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="px-5 py-2 text-xs font-semibold uppercase text-gray-500 bg-gray-50">
                    {results[0]?.type === "seller" ? "Creators" : "Products"}
                  </div>
                  {results.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={`w-full px-5 py-3 flex items-center gap-4 text-left transition-colors ${
                        i === selectedIndex ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-11 h-11 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        ) : item.type === "seller" ? (
                          <span className="text-lg font-bold text-gray-600">{item.name?.charAt(0)?.toUpperCase()}</span>
                        ) : (
                          <span className="text-xl">📦</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500 truncate">{item.description}</div>
                      </div>
                      {item.type === "product" && (
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-gray-900">
                            {item.currency === "INR" ? "₹" : "$"}{item.price}
                          </span>
                          {item.category && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium uppercase mt-1">
                              {item.category}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-4 py-12 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <div className="font-semibold text-lg mb-2 text-gray-900">No results found</div>
                  <div className="text-sm text-gray-500 mb-4">
                    Try different keywords or use <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-semibold">!</kbd> for filters
                  </div>
                  <button
                    onClick={() => setState(s => ({ ...s, query: "!" }))}
                    className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    View All Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {!query && (
            <div className="px-5 py-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { navigate(`/browse?category=${cat}`); onClose(); }}
                    className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showHelp && <HelpDocs onClose={() => setShowHelp(false)} />}
    </>
  );
}