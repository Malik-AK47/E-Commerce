// src/pages/Wishlist.jsx
import { Link } from "react-router-dom";

const Wishlist = ({ wishlist, toggleWishlist, addToCart }) => {
  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Add items you love and come back later.</p>
        <Link to="/" className="px-6 py-3 bg-black text-white rounded">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6">Wishlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wishlist.map(item => (
          <div key={item.id} className="bg-white p-4 rounded shadow">
            <img src={item.image} alt={item.name} className="h-48 w-full object-cover rounded" />
            <h3 className="mt-4 font-semibold">{item.name}</h3>
            <p className="text-gray-700">₹{item.price}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => addToCart(item)} className="flex-1 bg-black text-white py-2 rounded">Add to cart</button>
              <button onClick={() => toggleWishlist(item)} className="px-4 py-2 border rounded">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
