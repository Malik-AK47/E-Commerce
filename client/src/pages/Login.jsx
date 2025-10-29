import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      onLogin(user, token);
      // persist user locally as well
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 px-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>
        <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="Email" className="border w-full p-3 rounded-lg mb-4" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="Password" className="border w-full p-3 rounded-lg mb-4" />
        <button type="submit" className="w-full py-3 bg-black text-white rounded-lg">Login</button>
        <p className="text-center text-gray-600 text-sm mt-4">Don't have an account? <Link to="/register" className="text-black font-medium">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;
