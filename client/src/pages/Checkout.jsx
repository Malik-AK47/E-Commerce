import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const Checkout = ({ cart, saveOrder, user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    address: "",
    phoneNumber: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl mb-4">Add items before checkout</h2>
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.address || !formData.phoneNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // prepare payload expected by server
      const payload = {
        items: cart,
        shippingAddress: formData,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: 0,
        totalPrice: total
      };

      const res = await api.post('/orders', payload);
      // Save locally so UI immediately reflects it and clear cart
      saveOrder(res.data || {
        id: Date.now(), items: cart, shipping: formData, subtotal, tax, total, status: 'processing', date: new Date().toISOString()
      });
      navigate('/orders');
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section className="container mx-auto px-6 py-16">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">Checkout</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 shadow rounded h-fit">
          <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <div className="space-y-2">
            <p className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Tax (10%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </p>
            <p className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Shipping Form */}
        <div className="bg-white p-6 shadow rounded h-fit">
          <h3 className="font-semibold text-lg mb-4">Shipping Details</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full address"
                rows="3"
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your contact number"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded text-white transition ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
