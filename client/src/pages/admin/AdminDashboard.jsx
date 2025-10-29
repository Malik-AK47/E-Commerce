import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/products" className="p-6 bg-white rounded shadow hover:shadow-md">
          <h2 className="text-xl font-medium mb-2">Manage Products</h2>
          <p className="text-gray-600">Create, edit and delete products.</p>
        </Link>
        <Link to="/admin/orders" className="p-6 bg-white rounded shadow hover:shadow-md">
          <h2 className="text-xl font-medium mb-2">View Orders</h2>
          <p className="text-gray-600">See all orders placed by users.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
