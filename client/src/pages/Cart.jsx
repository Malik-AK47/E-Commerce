import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

const Cart = ({ cart, removeFromCart, updateQuantity }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({});
  
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% GST example
  const total = subtotal + tax;

  const handleQuantityUpdate = async (itemId, action) => {
    setLoading(prev => ({ ...prev, [itemId]: true }));
    try {
      if (action === "dec") {
        const item = cart.find(i => i.id === itemId);
        if (item && item.quantity <= 1) return;
      }
      await updateQuantity(itemId, action);
    } finally {
      setLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl mb-4">Your cart is empty 🛍️</h2>
        <Link 
          to="/" 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-16">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">Your Cart</h2>

      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 shadow rounded gap-4"
            role="listitem"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-600">{formatPrice(item.price)}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityUpdate(item.id, "dec")}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition disabled:opacity-50"
                  disabled={loading[item.id] || item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="text-lg w-8 text-center" role="spinbutton" aria-valuenow={item.quantity}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityUpdate(item.id, "inc")}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition disabled:opacity-50"
                  disabled={loading[item.id] || item.quantity >= 99}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              
              <p className="text-gray-800 font-medium">
                Subtotal: {formatPrice(item.price * item.quantity)}
              </p>

              <button
                onClick={() => removeFromCart(item.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                aria-label={`Remove ${item.name} from cart`}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-10 bg-gray-100 p-6 rounded shadow-md max-w-md ml-auto">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <p className="flex justify-between">
          <span>Subtotal:</span> <span>{formatPrice(subtotal)}</span>
        </p>
        <p className="flex justify-between mt-2">
          <span>Tax (10%):</span> <span>{formatPrice(tax)}</span>
        </p>
        <hr className="my-4" />
        <p className="flex justify-between text-xl font-bold">
          <span>Total:</span> <span>{formatPrice(total)}</span>
        </p>

        <div className="space-y-3 mt-6">
          <button
            onClick={() => navigate("/checkout")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Proceed to Checkout
          </button>
          
          <Link 
            to="/"
            className="block text-center w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cart;
