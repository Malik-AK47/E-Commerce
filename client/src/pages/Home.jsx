import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import SkeletonGrid from "../components/SkeletonGrid";

const Home = ({ wishlist = [], toggleWishlist }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    setLoadingProducts(true);
    api.get('/products')
      .then(res => {
        if (!mounted) return;
        // normalize backend products (_id) to include `id` so UI expects are consistent
        const items = (res.data || []).map(p => ({ ...p, id: p.id || p._id }));
        setProducts(items);
      })
      .catch(err => {
        console.error('Failed to load products', err);
      })
      .finally(() => setLoadingProducts(false));
    return () => { mounted = false; };
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchCategory = category === "All" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loadingProducts) return <div className="container mx-auto px-6 py-10"><SkeletonGrid /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6">Explore Products</h2>

      {/* Search + Category Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <input
          type="text"
          placeholder="Search product..."
          className="border py-2 px-4 rounded-lg w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border py-2 px-4 rounded-lg w-full md:w-1/4"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-center mt-20 text-lg">
          ❌ No product found!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="border rounded-xl shadow p-4 bg-white relative group">
              <Link
                to={`/product/${p.id}`}
                className="block hover:opacity-90 transition"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-48 w-full object-cover rounded-lg"
                />
                <h3 className="font-semibold mt-4">{p.name}</h3>
                <p className="text-gray-700 font-medium">₹{p.price}</p>
              </Link>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(p);
                }}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                aria-label={wishlist.some(item => item.id === p.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill={wishlist.some(item => item.id === p.id) ? "red" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
