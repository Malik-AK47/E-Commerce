// src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import { Toaster, toast } from "react-hot-toast";
import Wishlist from "./pages/Wishlist";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  // cart, wishlist, and auth are all lifted here
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null); // minimal user object or null
  const [loadingProducts, setLoadingProducts] = useState(true);

  // load from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist"));
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedCart) setCart(savedCart);
    if (savedWishlist) setWishlist(savedWishlist);
    if (savedUser) setUser(savedUser);
    // simulate product load delay for skeleton demonstration
    setTimeout(() => setLoadingProducts(false), 500);
  }, []);

  // persist
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("user", JSON.stringify(user)), [user]);

  // CART FUNCTIONS
  const addToCart = (product) => {
    setCart((prev) => {
      const itemExists = prev.find((it) => it.id === product.id);
      if (itemExists) {
        toast.success(`Increased ${product.name} quantity in cart`);
        return prev.map((it) => it.id === product.id ? { ...it, quantity: it.quantity + 1 } : it);
      }
      toast.success(`${product.name} added to cart`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    const product = cart.find(item => item.id === id);
    if (product) {
      toast.success(`${product.name} removed from cart`);
      setCart((prev) => prev.filter((it) => it.id !== id));
    }
  };

  const updateQuantity = (id, type) => {
    const product = cart.find(item => item.id === id);
    if (product) {
      if (type === "dec" && product.quantity === 1) {
        toast.success(`${product.name} removed from cart`);
      } else {
        toast.success(
          type === "inc" 
            ? `Increased ${product.name} quantity` 
            : `Decreased ${product.name} quantity`
        );
      }
    }
    setCart((prev) =>
      prev
        .map((it) => it.id === id ? { ...it, quantity: type === "inc" ? it.quantity + 1 : it.quantity - 1 } : it)
        .filter((it) => it.quantity > 0)
    );
  };

  // WISHLIST FUNCTIONS
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((it) => it.id === product.id);
      if (exists) {
        toast.success(`${product.name} removed from wishlist`);
        return prev.filter((it) => it.id !== product.id);
      }
      toast.success(`${product.name} added to wishlist`);
      return [...prev, product];
    });
  };

  // AUTH (fake)
  const handleLogin = (userData, token = "fake-token") => {
    localStorage.setItem("token", token);
    setUser(userData);
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success('Logged out successfully');
    // optionally clear ui-only info:
    // setCart([]); setWishlist([]);
  };

  // ORDERS - saved to localStorage when checkout happens (Checkout page will push orders)
  const saveOrder = (order) => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.unshift(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    // clear cart after placing order
    setCart([]);
    toast.success('Order placed successfully! 🎉', {
      duration: 5000,
      icon: '🛍️'
    });
  };

  return (
    <Router>
      <Toaster 
        position="top-center"
        toastOptions={{
          // Default options for all toasts
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Navbar
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        wishlistCount={wishlist.length}
        user={user}
        onLogout={handleLogout}
      />

      <main className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home loadingProducts={loadingProducts} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
          <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout cart={cart} saveOrder={saveOrder} user={user} />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleLogin} />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile user={user} />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={<Wishlist wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />} />
          {/* add NotFound route if you like */}
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
