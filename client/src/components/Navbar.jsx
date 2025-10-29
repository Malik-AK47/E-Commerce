// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiShoppingCart, FiHeart, FiUser } from "react-icons/fi";

const Navbar = ({ cartCount = 0, wishlistCount = 0, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition">
          ShopEase
        </Link>

        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-black transition">Home</Link>
          <Link to="/orders" className="hover:text-black transition">Orders</Link>

          <Link to="/cart" className="relative hover:text-black transition">
            <FiShoppingCart size={20} />
            <span className="absolute -top-2 -right-3 bg-black text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          </Link>

          <Link to="/wishlist" className="relative hover:text-black transition">
            <FiHeart size={20} />
            <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {wishlistCount}
            </span>
          </Link>

          {user && user.role === 'admin' && (
            <Link to="/admin" className="hover:text-black transition">Admin</Link>
          )}

          {!user ? (
            <Link to="/login" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">Login</Link>
          ) : (
            <div className="relative">
              <button className="flex items-center gap-2 border px-3 py-1 rounded" onClick={() => navigate("/profile")}>
                <FiUser /> <span className="hidden sm:inline">{user.name || "Me"}</span>
              </button>
              <button onClick={onLogout} className="ml-3 px-3 py-1 rounded bg-red-600 text-white">Logout</button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>☰</button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md p-4">
          <Link onClick={() => setIsOpen(false)} to="/" className="block py-2">Home</Link>
          <Link onClick={() => setIsOpen(false)} to="/cart" className="block py-2">Cart ({cartCount})</Link>
          <Link onClick={() => setIsOpen(false)} to="/wishlist" className="block py-2">Wishlist ({wishlistCount})</Link>
          {!user ? (
            <Link onClick={() => setIsOpen(false)} to="/login" className="block py-2">Login</Link>
          ) : (
            <>
              {user && user.role === 'admin' && (
                <Link onClick={() => setIsOpen(false)} to="/admin" className="block py-2">Admin</Link>
              )}
              <Link onClick={() => setIsOpen(false)} to="/profile" className="block py-2">Profile</Link>
              <button onClick={() => { onLogout(); setIsOpen(false); }} className="block py-2 text-left">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
