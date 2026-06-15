import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const res = await API.post("/auth/register", form);
      
      alert("Registration Successful! 🎉");
      console.log(res.data);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error during registration");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 w-full max-w-md shadow-xl shadow-gray-200/50">
        
       
        <div className="flex items-center gap-3 mb-5 justify-center">
          <div className="w-9 h-9 bg-[#5A52E5] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-[#5A52E5]/20">
            T
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">TaskFlow</h1>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Create your account</h2>
          <p className="text-sm text-gray-400 mt-1">Get started with your team collaboration tool</p>
        </div>

        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="Vaidehi Tiwari"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5A52E5]/20 focus:border-[#5A52E5] text-sm text-gray-700 placeholder-gray-300 transition-all"
              required
            />
          </div>

         
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="vaidehi@gmail.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5A52E5]/20 focus:border-[#5A52E5] text-sm text-gray-700 placeholder-gray-300 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5A52E5]/20 focus:border-[#5A52E5] text-sm text-gray-700 placeholder-gray-300 transition-all"
              required
            />
          </div>

          
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">Select Role</label>
            <div className="relative">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5A52E5]/20 focus:border-[#5A52E5] text-sm text-gray-700 transition-all cursor-pointer appearance-none"
              >
                <option value="user">User (Team Member)</option>
                <option value="admin">Admin (Project Manager)</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 text-xs">
                ▼
              </div>
            </div>
          </div>

         
          <button
            type="submit"
            className="w-full bg-[#5A52E5] hover:bg-[#4941CD] text-white text-sm font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-[#5A52E5]/25 mt-4"
          >
            Register Account
          </button>
        </form>

       
        <div className="text-center mt-6 pt-5 border-t border-gray-50">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#5A52E5] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;