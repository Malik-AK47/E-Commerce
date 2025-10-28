import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // in real app you'll fetch. Here we fake success:
    const userData = { name: email.split("@")[0], email };
    onLogin(userData, "fake-token-123");
    navigate("/");
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
