import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api"; 

function Settings() {
  const getCachedUser = () => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : { id: null, name: "Anushka", email: "anushka@gmail.com", role: "User" };
  };

  const cachedUser = getCachedUser();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    setProfile({
      name: cachedUser.name || "",
      email: cachedUser.email || "",
    });
  }, []);

  // 📝 १. प्रोफाईल बदल (Name & Email Update)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    
    try {
      const token = localStorage.getItem("token"); 
      const targetUserId = cachedUser.id || cachedUser._id; 

      const res = await API.put("/auth/update-profile", {
        name: profile.name,
        email: profile.email,
        userId: targetUserId 
      }, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });

      const updatedUser = { ...cachedUser, name: profile.name, email: profile.email };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated in database successfully! 🎉");
      window.location.reload(); 
    } catch (err) {
      console.error(err); // 👈 इथे आधी चूक झाली असू शकते, आता फिक्स केली आहे
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  // 🔒 २. पासवर्ड बदल (Password Update)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("New passwords do not match! ❌");
      return;
    }

    setLoadingPassword(true);

    try {
      const token = localStorage.getItem("token");
      const targetUserId = cachedUser.id || cachedUser._id;

      await API.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        userId: targetUserId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Password updated in database successfully! 🔒🎉");
      setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoadingPassword(false);
    }
  };

  const avatarInitials = profile.name ? profile.name.substring(0, 2).toUpperCase() : "AN";

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen text-gray-800">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        {/* Top Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Hello, {profile.name || "Anushka"} 👋</h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage your workspace settings here.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{profile.name || "Anushka"}</p>
              <p className="text-[10px] text-gray-400 capitalize">{cachedUser.role || "User"}</p>
            </div>
            <div className="w-10 h-10 bg-[#5A52E5] rounded-full flex items-center justify-center text-white font-bold text-sm">
              {avatarInitials}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage your account preferences and security settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Form */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20">
            <h3 className="text-base font-bold text-gray-800 mb-2 tracking-tight">Profile Information</h3>
            <p className="text-xs text-gray-400 mb-6">Update your account personal details</p>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50/70 border border-gray-100 rounded-2xl text-sm font-medium text-gray-700 focus:outline-none focus:border-[#5A52E5]/30 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50/70 border border-gray-100 rounded-2xl text-sm font-medium text-gray-700 focus:outline-none focus:border-[#5A52E5]/30 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loadingProfile}
                className="bg-[#5A52E5] text-white text-xs font-bold px-5 py-3 rounded-2xl hover:bg-[#4941CD] transition-all shadow-md shadow-[#5A52E5]/25 disabled:opacity-50"
              >
                {loadingProfile ? "Saving Changes..." : "Save Profile Changes"}
              </button>
            </form>
          </div>

          {/* Password Form */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20">
            <h3 className="text-base font-bold text-gray-800 mb-2 tracking-tight">Security & Password</h3>
            <p className="text-xs text-gray-400 mb-6">Change your password regularly to keep secure</p>

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50/70 border border-gray-100 rounded-2xl text-sm font-medium text-gray-700 focus:outline-none focus:border-[#5A52E5]/30 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50/70 border border-gray-100 rounded-2xl text-sm font-medium text-gray-700 focus:outline-none focus:border-[#5A52E5]/30 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50/70 border border-gray-100 rounded-2xl text-sm font-medium text-gray-700 focus:outline-none focus:border-[#5A52E5]/30 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loadingPassword}
                className="bg-[#1F2937] text-white text-xs font-bold px-5 py-3 rounded-2xl hover:bg-[#111827] transition-all shadow-md disabled:opacity-50"
              >
                {loadingPassword ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;