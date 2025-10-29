// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get('/orders/myorders')
      .then(res => { if (mounted) setOrders(res.data || []); })
      .catch(err => {
        console.error('Failed to fetch orders', err);
        // fallback to localStorage
        const saved = JSON.parse(localStorage.getItem('orders') || '[]');
        if (mounted) setOrders(saved);
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="container mx-auto px-6 py-16 text-center">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
        <p className="text-gray-500">Place an order and it will show up here.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6">Your Orders</h2>
      <div className="space-y-4">
        {orders.map((ord, i) => (
          <div key={ord._id || i} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">Order #{i + 1} — ₹{(ord.totalPrice ?? ord.total ?? 0).toFixed(2)}</p>
            <p className="text-sm text-gray-500">Items: {(ord.items || []).length}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
