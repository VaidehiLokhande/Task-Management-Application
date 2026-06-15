import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function Team() {
  const getCachedUser = () => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : { name: "User", role: "User" };
  };

  const cachedUser = getCachedUser();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Initial State including Password
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Full Stack Developer",
    expertise: "",
    status: "Active",
    password: "" // 👈 Password state mapped here
  });

  const fetchTeamData = async () => {
    try {
      const res = await API.get("/users/team");
      if (res.data.success) {
        setTeamMembers(res.data.team);
      }
    } catch (err) {
      console.error("Failed to load active project workspace team:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 2. Sending complete validated formData object
      const res = await API.post("/users/invite", formData);
      if (res.data.success) {
        alert("Member invited successfully!");
        setIsModalOpen(false);
        // Reset form safely
        setFormData({ name: "", email: "", role: "Full Stack Developer", expertise: "", status: "Active", password: "" });
        fetchTeamData();
      }
    } catch (err) {
      console.error("Invitation submission error:", err);
      alert(err.response?.data?.message || "Failed to invite member");
    }
  };

  const getInitials = (name) => {
    if (!name) return "TM";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  if (loading) {
    return (
      <div className="flex bg-[#F8F9FA] min-h-screen items-center justify-center">
        <p className="text-sm font-semibold text-gray-400 animate-pulse">Loading dynamic team workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen text-gray-800 font-sans relative">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        {/* Top Header Row */}
        <div className="bg-white px-8 py-5 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Hello, {cachedUser.name} 👋</h2>
            <p className="text-xs text-gray-400 mt-0.5">Have a productive day ahead!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{cachedUser.name}</p>
              <p className="text-[10px] text-gray-400 capitalize">{cachedUser.role}</p>
            </div>
            <div className="w-10 h-10 bg-[#5A52E5] rounded-full flex items-center justify-center text-white font-bold text-sm">
              {cachedUser.name ? cachedUser.name.substring(0, 2).toUpperCase() : "US"}
            </div>
          </div>
        </div>

        {/* Panel Actions Title Row */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Team Members</h1>
            <p className="text-xs text-gray-400 mt-1">Manage your project collaborators and roles</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#5A52E5] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:bg-[#4B43D3] transition-all cursor-pointer"
          >
            + Invite Member
          </button>
        </div>

        {/* Members Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.length === 0 ? (
            <p className="text-xs text-gray-400 py-4 col-span-3 text-center">No team members discovery logged.</p>
          ) : (
            teamMembers.map((member) => (
              <div key={member.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-[#5A52E5] rounded-full flex items-center justify-center font-bold text-base shadow-inner">
                    {getInitials(member.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-800 truncate">{member.name}</h3>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5 truncate capitalize">
                      {member.role || "Contributor"}
                    </p>
                  </div>
                </div>

                <div className="my-5 space-y-2 text-[11px] font-medium text-gray-500 border-t border-b border-gray-50 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-gray-700 font-semibold truncate max-w-[180px]">{member.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Expertise:</span>
                    <span className="text-gray-700 font-semibold truncate max-w-[180px]">
                      {member.expertise || "React, Node.js"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${member.status === "Away" ? "bg-amber-400" : "bg-green-500"}`} />
                    <span className="text-[11px] text-gray-400 font-semibold">{member.status || "Active"}</span>
                  </div>
                  <button className="text-[11px] font-bold text-[#5A52E5] hover:underline">Manage Role</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ==================== INTERACTIVE POPUP MODAL ==================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-800">Invite Team Member</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg font-bold">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
                <input 
                  type="text" required placeholder="e.g. Rahul Sharma"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full text-xs p-3 border border-gray-100 bg-gray-50/50 rounded-xl focus:outline-none focus:border-[#5A52E5]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
                <input 
                  type="email" required placeholder="rahul@example.com"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full text-xs p-3 border border-gray-100 bg-gray-50/50 rounded-xl focus:outline-none focus:border-[#5A52E5]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Workspace Role</label>
                <select 
                  value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full text-xs p-3 border border-gray-100 bg-gray-50/50 rounded-xl focus:outline-none focus:border-[#5A52E5]"
                >
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Admin">Admin / Manager</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Expertise Stack</label>
                <input 
                  type="text" placeholder="e.g. Express, PostgreSQL"
                  value={formData.expertise} onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                  className="w-full text-xs p-3 border border-gray-100 bg-gray-50/50 rounded-xl focus:outline-none focus:border-[#5A52E5]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Login Password</label>
                <input 
                  type="password" 
                  required 
                  placeholder="Set password for this member"
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full text-xs p-3 border border-gray-100 bg-gray-50/50 rounded-xl focus:outline-none focus:border-[#5A52E5]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-600 font-semibold text-xs py-3 rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
                <button type="submit" className="flex-1 bg-[#5A52E5] text-white font-semibold text-xs py-3 rounded-xl hover:bg-[#4B43D3] transition-all shadow-md shadow-[#5A52E5]/10">Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Team;