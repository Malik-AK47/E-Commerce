import { useParams } from "react-router-dom";
import products from "../data/products";

const ProductDetails = ({ addToCart, toggleWishlist, wishlist = [] }) => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <h2 className="text-center py-20 text-xl">Product Not Found</h2>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 flex gap-8">
      <img
        src={product.image}
        alt={product.name}
        className="w-1/2 h-96 object-cover rounded-lg"
      />

      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-500 mb-4">{product.category}</p>
        <p className="text-gray-700 mb-6">{product.description}</p>
        <p className="text-2xl font-bold mb-6">₹{product.price}</p>

        <div className="flex gap-4">
          <button
            onClick={() => addToCart(product)}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Add to Cart
          </button>
          
          <button
            onClick={() => toggleWishlist(product)}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            aria-label={wishlist.some(item => item.id === product.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill={wishlist.some(item => item.id === product.id) ? "red" : "none"}
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
            {wishlist.some(item => item.id === product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
