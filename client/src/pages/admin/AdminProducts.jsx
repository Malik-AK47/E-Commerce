import { useEffect, useState } from 'react';
import api from '../../api/axios';

const emptyForm = { name: '', description: '', price: 0, category: '', image: '', countInStock: 0 };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products')
      .then(res => {
        const items = (res.data || []).map(p => ({ ...p, id: p.id || p._id }));
        setProducts(items);
      })
      .catch(err => console.error('Failed to load products', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/products', form);
      const p = { ...res.data, id: res.data.id || res.data._id };
      setProducts(prev => [p, ...prev]);
      setForm(emptyForm);
    } catch (err) {
      console.error('Create failed', err);
      alert(err?.response?.data?.msg || 'Create failed');
    }
  };

  const handleEditInit = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, image: p.image, countInStock: p.countInStock });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/products/${editing}`, form);
      setProducts(prev => prev.map(it => it.id === editing ? ({ ...res.data, id: res.data.id || res.data._id }) : it));
      setEditing(null);
      setForm(emptyForm);
    } catch (err) {
      console.error('Update failed', err);
      alert(err?.response?.data?.msg || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert(err?.response?.data?.msg || 'Delete failed');
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Products</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="font-medium mb-3">{editing ? 'Edit Product' : 'Create Product'}</h3>
        <form onSubmit={editing ? handleUpdate : handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" required />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border p-2 rounded" />
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className="border p-2 rounded" required />
          <input name="countInStock" type="number" value={form.countInStock} onChange={handleChange} placeholder="Stock" className="border p-2 rounded" />
          <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="border p-2 rounded" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded md:col-span-2" />

          <div className="md:col-span-2 flex gap-2">
            {editing ? (
              <>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
                <button type="button" onClick={() => { setEditing(null); setForm(emptyForm); }} className="px-4 py-2 border rounded">Cancel</button>
              </>
            ) : (
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Create</button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-medium mb-3">Products List</h3>
        {loading ? <p>Loading...</p> : (
          <div className="space-y-4">
            {products.map(p => (
              <div key={p.id} className="flex items-center justify-between border rounded p-3">
                <div className="flex items-center gap-4">
                  <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded" />
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-gray-600">₹{p.price} • {p.category}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditInit(p)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;