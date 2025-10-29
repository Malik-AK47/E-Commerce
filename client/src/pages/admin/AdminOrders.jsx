import { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get('/orders')
      .then(res => { if (mounted) setOrders(res.data || []); })
      .catch(err => console.error('Failed to fetch orders', err))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>
      <div className="bg-white p-6 rounded shadow">
        {loading ? <p>Loading...</p> : (
          <div className="space-y-4">
            {orders.length === 0 ? <p>No orders yet.</p> : orders.map(o => (
              <div key={o._id} className="border rounded p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Order: {o._id}</div>
                    <div className="text-sm text-gray-600">User: {o.user?.email || o.user?.name || '—'}</div>
                    <div className="text-sm">Total: ₹{(o.totalPrice || o.total || 0).toFixed(2)}</div>
                  </div>
                  <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-medium">Items:</div>
                  <ul className="list-disc ml-6">
                    {(o.items || []).map((it, i) => (
                      <li key={i}>{it.name} x {it.quantity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;