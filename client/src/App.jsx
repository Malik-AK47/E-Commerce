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
import api from "./api/axios";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsValidating(false);
      return;
    }
    
    api.get('/auth/me')
      .then(() => setIsValidating(false))
      .catch(() => {
        localStorage.removeItem('token');
        setIsValidating(false);
      });
  }, []);

  if (isValidating) {
    return <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function ProtectedAdminRoute({ children, user }) {
  const token = localStorage.getItem("token");
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsValidating(false);
      return;
    }

    api.get('/auth/me')
      .then(() => setIsValidating(false))
      .catch(() => {
        localStorage.removeItem('token');
        setIsValidating(false);
      });
  }, []);

  if (isValidating) {
    return <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (!token) return <Navigate to="/login" replace />;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
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

  // if token exists, validate and fetch user profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    // api interceptor already attaches token; try to fetch current user
    api.get('/auth/me')
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.warn('Failed to fetch user profile, clearing token');
        localStorage.removeItem('token');
        setUser(null);
      });
  }, []);

  // persist
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("user", JSON.stringify(user)), [user]);

  // CART FUNCTIONS
  const addToCart = (product) => {
    const exists = cart.find((it) => it.id === product.id);
    setCart((prev) => {
      if (exists) {
        return prev.map((it) => it.id === product.id ? { ...it, quantity: it.quantity + 1 } : it);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // show toast after scheduling state update
    if (exists) {
      toast.success(`Increased ${product.name} quantity in cart`);
    } else {
      toast.success(`${product.name} added to cart`);
    }
  };

  const removeFromCart = (id) => {
    const product = cart.find(item => item.id === id);
    if (product) {
      setCart((prev) => prev.filter((it) => it.id !== id));
      toast.success(`${product.name} removed from cart`);
    }
  };

  const updateQuantity = (id, type) => {
    const product = cart.find(item => item.id === id);
    if (product) {
      // schedule update
      setCart((prev) =>
        prev
          .map((it) => it.id === id ? { ...it, quantity: type === "inc" ? it.quantity + 1 : it.quantity - 1 } : it)
          .filter((it) => it.quantity > 0)
      );

      // show message after scheduling
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
  };

  // WISHLIST FUNCTIONS
  const toggleWishlist = (product) => {
    const exists = wishlist.find((it) => it.id === product.id);
    setWishlist((prev) => {
      if (exists) return prev.filter((it) => it.id !== product.id);
      return [...prev, product];
    });
    if (exists) {
      toast.success(`${product.name} removed from wishlist`);
    } else {
      toast.success(`${product.name} added to wishlist`);
    }
  };

  // AUTH
  const handleLogin = (userData, token = null) => {
    if (token) localStorage.setItem("token", token);
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

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedAdminRoute user={user}><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/products" element={<ProtectedAdminRoute user={user}><AdminProducts /></ProtectedAdminRoute>} />
          <Route path="/admin/orders" element={<ProtectedAdminRoute user={user}><AdminOrders /></ProtectedAdminRoute>} />

          {/* add NotFound route if you like */}
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
