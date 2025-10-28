// src/pages/Orders.jsx
import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(saved);
  }, []);

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
          <div key={i} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">Order #{i + 1} — ₹{ord.total.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Items: {ord.items.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
