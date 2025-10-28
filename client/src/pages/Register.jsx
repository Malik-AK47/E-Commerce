import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = ({ onRegister }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const userData = { name, email };
    onRegister(userData, "fake-token-123");
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 px-4">
      <form onSubmit={handleRegister} className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Create Account</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full Name" className="border w-full p-3 rounded-lg mb-4" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="Email" className="border w-full p-3 rounded-lg mb-4" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="Password" className="border w-full p-3 rounded-lg mb-4" />
        <button type="submit" className="w-full py-3 bg-black text-white rounded-lg">Register</button>
        <p className="text-center text-gray-600 text-sm mt-4">Already have an account? <Link to="/login" className="text-black font-medium">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;
