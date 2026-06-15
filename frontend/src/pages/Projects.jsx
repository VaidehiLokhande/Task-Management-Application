import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api"; 
function Projects() {
 
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); 
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await API.get("/projects");
      
      console.log("Backend Response:", res.data); 

     
      if (Array.isArray(res.data)) {
        setProjects(res.data);
      } 
    
      else if (res.data && Array.isArray(res.data.projects)) {
        setProjects(res.data.projects);
      } else if (res.data && Array.isArray(res.data.data)) {
        setProjects(res.data.data);
      } 
      
      else {
        setProjects([]);
      }

    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]); 
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projects", newProject);
      alert("Project Created Successfully! 🎉");
      setNewProject({ name: "", description: "" });
      setShowModal(false); 
      fetchProjects(); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen text-gray-800">
     
      <Sidebar />

      
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-500 mt-1">All team projects and workspaces</p>
          </div>

         
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#5A52E5] hover:bg-[#4941CD] text-white text-sm font-bold px-5 py-3 rounded-2xl transition-all shadow-lg shadow-[#5A52E5]/25"
            >
              + New Project
            </button>
          )}
        </div>

        
        {loading ? (
          <p className="text-gray-500 text-sm">Loading projects from Supabase...</p>
        ) : projects.length === 0 ? (
          <div className="bg-white border border-gray-100 p-12 rounded-3xl text-center shadow-sm">
            <p className="text-gray-400 text-sm">No projects found. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 bg-[#5A52E5]/10 text-[#5A52E5] rounded-xl flex items-center justify-center font-bold text-lg mb-4">
                    📁
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-3">{project.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                  <span>Created by: {project.created_by === user?.id ? "You" : "Manager"}</span>
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

       
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Create New Project</h2>
              <p className="text-xs text-gray-400 mb-6">Setup a new workspace for your team.</p>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Project Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Remote Rehab AI"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5A52E5]/20 focus:border-[#5A52E5] text-sm text-gray-700 placeholder-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Description</label>
                  <textarea
                    placeholder="Describe the goals of this project..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5A52E5]/20 focus:border-[#5A52E5] text-sm text-gray-700 placeholder-gray-300 h-24 resize-none"
                    required
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold py-3.5 rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-[#5A52E5] hover:bg-[#4941CD] text-white text-sm font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-[#5A52E5]/25"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;