import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBasket01Icon,
  UserIcon,
  Tag01Icon,
  DollarCircleIcon,
  SparklesIcon,
  AnalyticsUpIcon
} from "hugeicons-react";

const FILTERS = [
  { id: "products", label: "Products", icon: ShoppingBasket01Icon, search: "" },
  { id: "creators", label: "Creators", icon: UserIcon, search: "!s " },
  { id: "category", label: "Category", icon: Tag01Icon, search: "!c " },
  { id: "price", label: "Price", icon: DollarCircleIcon, search: "!p " },
  { id: "new", label: "New", icon: SparklesIcon, search: "!new " },
  { id: "top", label: "Top", icon: AnalyticsUpIcon, search: "!top " },
];

const CATEGORIES = ["Design", "Development", "Marketing", "Business", "3D", "Education", "Photography", "Writing"];
const PRICE_RANGES = [
  { label: "Under $10", value: 10 },
  { label: "Under $50", value: 50 },
  { label: "Under $100", value: 100 },
  { label: "Under $500", value: 500 },
];

const initialState = { query: "", results: [], loading: false, selectedIndex: 0, activeFilter: null };

export default function SpotlightSearch({ isOpen, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [state, setState] = useState(initialState);
  const { query, results, loading, selectedIndex, activeFilter } = state;

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
      setState(s => ({ ...s, results: [], activeFilter: null }));
      return;
    }

    const parsed = parseBangs(query);
    const timer = setTimeout(async () => {
      setState(s => ({ ...s, loading: true }));
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        
        if (parsed.seller) {
          setState(s => ({ ...s, activeFilter: "creators" }));
          const res = await fetch(`${API_URL}/api/profile/search?q=${encodeURIComponent(parsed.query)}`);
          const data = await res.json();
          setState(s => ({
            ...s,
            loading: false,
            results: (data.profiles || []).slice(0, 8).map(p => ({
              type: "seller",
              id: p.id,
              name: p.display_name || p.name,
              description: p.bio || "Creator",
              image: p.profile_image_url,
            })),
          }));
        } else {
          const filterType = parsed.sort ? (parsed.sort === "newest" ? "new" : "top") : 
                           parsed.category ? "category" : 
                           parsed.maxPrice ? "price" : 
                           "products";
          setState(s => ({ ...s, activeFilter: filterType }));
          
          let url = `${API_URL}/api/products/list`;
          const params = new URLSearchParams();
          
          if (parsed.query) params.append("search", parsed.query);
          if (parsed.category) params.append("category", parsed.category);
          if (parsed.maxPrice) params.append("maxPrice", parsed.maxPrice);
          if (parsed.sort) params.append("sort", parsed.sort);
          
          const queryString = params.toString();
          if (queryString) url += `?${queryString}`;
          
          const res = await fetch(url);
          const data = await res.json();
          setState(s => ({
            ...s,
            loading: false,
            results: (data.products || []).slice(0, 8).map(p => ({
              type: "product",
              id: p.id,
              name: p.name,
              description: p.description?.slice(0, 100) || "",
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
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setState(s => ({ ...s, selectedIndex: Math.min(s.selectedIndex + 1, results.length - 1) }));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setState(s => ({ ...s, selectedIndex: Math.max(s.selectedIndex - 1, 0) }));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
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
    } else if (item.type === "category") {
      setState(s => ({ ...s, query: `!c ${item.id}`, activeFilter: "category" }));
      setTimeout(() => inputRef.current?.focus(), 0);
    } else if (item.type === "price") {
      setState(s => ({ ...s, query: `!p ${item.id}`, activeFilter: "price" }));
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      navigate(`/product/${item.id}`);
    }
    if (item.type === "seller" || item.type === "product") {
      onClose();
    }
  };

  const handleFilterClick = async (filter) => {
    setState(s => ({ ...s, query: filter.search, activeFilter: filter.id, loading: true, results: [] }));
    setTimeout(() => inputRef.current?.focus(), 0);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      
      if (filter.id === "creators") {
        const res = await fetch(`${API_URL}/api/profile/search?q=&limit=50`);
        const data = await res.json();
        setState(s => ({
          ...s,
          loading: false,
          results: (data.profiles || []).slice(0, 8).map(p => ({
            type: "seller",
            id: p.id,
            name: p.display_name || p.name,
            description: p.bio || "Creator",
            image: p.profile_image_url,
          })),
        }));
      } else if (filter.id === "category") {
        setState(s => ({
          ...s,
          loading: false,
          results: CATEGORIES.map(cat => ({
            type: "category",
            id: cat,
            name: cat,
            description: `Browse ${cat} products`,
          })),
        }));
      } else if (filter.id === "price") {
        setState(s => ({
          ...s,
          loading: false,
          results: PRICE_RANGES.map(range => ({
            type: "price",
            id: range.value,
            name: range.label,
            description: `Browse products ${range.label.toLowerCase()}`,
          })),
        }));
      } else if (filter.id === "products") {
        const res = await fetch(`${API_URL}/api/products/list?sort=newest&limit=8`);
        const data = await res.json();
        setState(s => ({
          ...s,
          loading: false,
          results: (data.products || []).map(p => ({
            type: "product",
            id: p.id,
            name: p.name,
            description: p.description?.slice(0, 100) || "",
            price: p.price,
            currency: p.currency,
            category: p.category?.[0],
            image: p.thumbnail_url,
          })),
        }));
      } else if (filter.id === "new") {
        const res = await fetch(`${API_URL}/api/products/list?sort=newest&limit=8`);
        const data = await res.json();
        setState(s => ({
          ...s,
          loading: false,
          results: (data.products || []).map(p => ({
            type: "product",
            id: p.id,
            name: p.name,
            description: p.description?.slice(0, 100) || "",
            price: p.price,
            currency: p.currency,
            category: p.category?.[0],
            image: p.thumbnail_url,
          })),
        }));
      } else if (filter.id === "top") {
        const res = await fetch(`${API_URL}/api/products/list?sort=rating&limit=8`);
        const data = await res.json();
        setState(s => ({
          ...s,
          loading: false,
          results: (data.products || []).map(p => ({
            type: "product",
            id: p.id,
            name: p.name,
            description: p.description?.slice(0, 100) || "",
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
  };

  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selected = resultsRef.current.children[selectedIndex];
      selected?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const showSuggestion = query && results.length === 0 && !loading;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in" />
      
      <div 
        className="relative w-full max-w-4xl bg-white/98 backdrop-blur-2xl rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden animate-spotlight-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-6 py-5 border-b border-gray-100">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setState(s => ({ ...s, query: e.target.value, selectedIndex: 0 }))}
            onKeyDown={handleKeyDown}
            placeholder="Spotlight Search"
            className="flex-1 text-2xl font-medium bg-transparent outline-none placeholder:text-gray-400 text-gray-900"
          />
          <kbd className="hidden sm:flex items-center justify-center w-8 h-8 text-xs font-bold bg-gray-100 text-gray-500 rounded-lg shadow-sm">
            ⎋
          </kbd>
        </div>

        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 overflow-x-auto scrollbar-hide">
          {FILTERS.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => handleFilterClick(filter)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all flex-shrink-0 ${
                  isActive 
                    ? "bg-blue-500 text-white shadow-lg scale-105" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                <Icon size={18} strokeWidth={2.5} />
                {filter.label}
              </button>
            );
          })}
        </div>

        {!query && !activeFilter && (
          <div className="px-6 py-8 text-center">
            <div className="text-6xl mb-4 animate-bounce-subtle">🔍</div>
            <p className="text-base text-gray-500">Start typing to search products and creators</p>
          </div>
        )}

        {(query || activeFilter) && (
          <div className="max-h-[60vh] overflow-y-auto" ref={resultsRef}>
            {loading ? (
              <div className="px-6 py-16 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-3" />
                <p className="text-sm text-gray-500">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`w-full px-6 py-5 flex items-center gap-5 text-left transition-all ${
                      i === selectedIndex 
                        ? "bg-blue-50 border-l-4 border-blue-500" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      ) : item.type === "seller" ? (
                        <span className="text-3xl font-black text-gray-600">
                          {item.name?.charAt(0)?.toUpperCase()}
                        </span>
                      ) : item.type === "category" ? (
                        <Tag01Icon size={32} className="text-gray-400" strokeWidth={2} />
                      ) : item.type === "price" ? (
                        <DollarCircleIcon size={32} className="text-gray-400" strokeWidth={2} />
                      ) : (
                        <ShoppingBasket01Icon size={32} className="text-gray-400" strokeWidth={2} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate text-xl">{item.name}</div>
                      <div className="text-base text-gray-500 truncate">{item.description}</div>
                    </div>
                    {item.type === "product" && (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xl font-bold text-gray-900">
                          {item.currency === "INR" ? "₹" : "$"}{item.price}
                        </span>
                        {item.category && (
                          <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded-md font-bold uppercase tracking-wide">
                            {item.category}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : showSuggestion ? (
              <div className="px-6 py-12 text-center">
                <div className="text-5xl mb-4">💡</div>
                <div className="font-semibold text-xl mb-2 text-gray-900">No results found</div>
                <p className="text-sm text-gray-500 mb-6">
                  Looking for something else?
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {FILTERS.slice(1, 4).map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => handleFilterClick(filter)}
                      className="px-4 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    >
                      Try {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}