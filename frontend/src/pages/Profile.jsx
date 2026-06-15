import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function Profile() {
 
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalProjects: 0,
    tasksDone: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      
      
      const [projectsRes, tasksRes] = await Promise.all([
        API.get("/projects"),
        API.get("/tasks"),
      ]);

      let projectsArr = [];
      if (projectsRes.data && Array.isArray(projectsRes.data.projects)) {
        projectsArr = projectsRes.data.projects;
      } else if (Array.isArray(projectsRes.data)) {
        projectsArr = projectsRes.data;
      }

      
      let tasksArr = [];
      if (tasksRes.data && Array.isArray(tasksRes.data.tasks)) {
        tasksArr = tasksRes.data.tasks;
      } else if (Array.isArray(tasksRes.data)) {
        tasksArr = tasksRes.data;
      }

      const completedCount = tasksArr.filter(t => t.status?.toUpperCase() === "DONE").length;

      setStats({
        totalProjects: projectsArr.length,
        tasksDone: completedCount,
      });
    } catch (err) {
      console.error("Error fetching profile metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

 
  const avatarInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : "AN";

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen text-gray-800">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Hello, {user?.name || "Anushka"} 👋</h2>
            <p className="text-xs text-gray-400 mt-0.5">Have a productive day ahead!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">{user?.name || "Anushka"}</p>
              <p className="text-[10px] text-gray-400 capitalize">{user?.role || "User"}</p>
            </div>
            <div className="w-10 h-10 bg-[#5A52E5] rounded-full flex items-center justify-center text-white font-bold text-sm">
              {avatarInitials}
            </div>
          </div>
        </div>

       
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-xs text-gray-400 mt-0.5">View your personal account details and statistics</p>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading your profile details...</p>
        ) : (
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
           
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 text-center">
              <div className="w-28 h-28 bg-[#5A52E5] rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg shadow-[#5A52E5]/20">
                {avatarInitials}
              </div>
              <h2 className="text-xl font-bold text-gray-800">{user?.name || "Anushka"}</h2>
              <span className="bg-[#5A52E5]/5 text-[#5A52E5] text-[10px] font-bold px-3 py-1 rounded-full mt-2 inline-block capitalize">
                {user?.role || "User"}
              </span>

              <hr className="my-6 border-gray-100" />

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <h3 className="text-xl font-black text-gray-800">{stats.totalProjects}</h3>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1">Projects</p>
                </div>
                <div className="text-center border-l border-gray-100">
                  <h3 className="text-xl font-black text-green-500">{stats.tasksDone}</h3>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1">Tasks Done</p>
                </div>
              </div>
            </div>

            
            <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20">
              <h3 className="text-base font-bold text-gray-800 mb-6 tracking-tight">Account Details</h3>

              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center py-3 border-b border-gray-50">
                  <span className="text-xs font-bold text-gray-400 md:w-1/3">Full Name</span>
                  <span className="text-sm font-semibold text-gray-700 mt-1 md:mt-0">{user?.name || "Anushka"}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center py-3 border-b border-b border-gray-50">
                  <span className="text-xs font-bold text-gray-400 md:w-1/3">Email Address</span>
                  <span className="text-sm font-semibold text-gray-700 mt-1 md:mt-0">{user?.email || "anushka@gmail.com"}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center py-3 border-b border-b border-gray-50">
                  <span className="text-xs font-bold text-gray-400 md:w-1/3">Account Role</span>
                  <span className="text-sm font-semibold text-gray-700 mt-1 md:mt-0 capitalize">{user?.role || "User"}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center py-3">
                  <span className="text-xs font-bold text-gray-400 md:w-1/3">Location</span>
                  <span className="text-sm font-semibold text-gray-700 mt-1 md:mt-0">Maharashtra, India</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;