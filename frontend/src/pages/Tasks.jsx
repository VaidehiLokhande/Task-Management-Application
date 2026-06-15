import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function Tasks() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]); 
  const [teamMembers, setTeamMembers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "To Do",
    due_date: "",
    project_id: "",
    assigned_to: "", 
  });

  
  const [localStatuses, setLocalStatuses] = useState({});

  const fetchTasksProjectsAndTeam = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes, teamRes] = await Promise.all([
        API.get("/tasks"),
        API.get("/projects"),
        API.get("/users/team"), 
      ]);

      if (tasksRes.data && Array.isArray(tasksRes.data.tasks)) {
        setTasks(tasksRes.data.tasks);
        
        const statuses = {};
        tasksRes.data.tasks.forEach(t => {
          statuses[t.id] = t.status || "To Do";
        });
        setLocalStatuses(statuses);
      }
      if (projectsRes.data && Array.isArray(projectsRes.data.projects)) {
        setProjects(projectsRes.data.projects);
      }
      if (teamRes.data && Array.isArray(teamRes.data.team)) {
        setTeamMembers(teamRes.data.team);
      }
    } catch (err) {
      console.error("Error fetching workspace data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksProjectsAndTeam();
  }, []);

  
  const handleDropdownChange = (taskId, selectedStatus) => {
    setLocalStatuses(prev => ({
      ...prev,
      [taskId]: selectedStatus
    }));
  };


  const handleSubmitStatus = async (taskId) => {
    const finalStatus = localStatuses[taskId];
    let githubUrl = null;

    
    if (finalStatus === "Completed") {
      const urlInput = prompt("Please enter your GitHub repository or project link to submit work:");
      if (urlInput === null) return; 
      if (urlInput.trim() === "") {
        alert("GitHub URL is mandatory to complete the task!");
        return;
      }
      githubUrl = urlInput.trim();
    }

    try {
      
      const res = await API.put(`/tasks/${taskId}/status`, { 
        status: finalStatus,
        github_url: githubUrl 
      });

      if (res.data.success) {
        alert(`Task status submitted as "${finalStatus}"! 🎉`);
        
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, status: finalStatus, github_url: githubUrl } : task
          )
        );
      }
    } catch (err) {
      console.error("Failed to submit work status:", err);
      alert("Error submitting task update. Make sure backend is updated!");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", newTask);
      alert("Task Created & Assigned Successfully! 🎉");
      setNewTask({ title: "", description: "", priority: "Medium", status: "To Do", due_date: "", project_id: "", assigned_to: "" });
      setShowModal(false);
      fetchTasksProjectsAndTeam(); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen text-gray-800">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        {/* हेडर */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your team responsibilities</p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#5A52E5] hover:bg-[#4941CD] text-white text-sm font-bold px-5 py-3 rounded-2xl transition-all shadow-lg shadow-[#5A52E5]/25 cursor-pointer"
            >
              + New Task
            </button>
          )}
        </div>

        
        {loading ? (
          <p className="text-gray-500 text-sm animate-pulse">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="bg-white border border-gray-100 p-12 rounded-3xl text-center shadow-sm">
            <p className="text-gray-400 text-sm">No tasks assigned yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-5">Task Title</th>
                  <th className="p-5">Assignee</th>
                  <th className="p-5">Priority</th>
                  <th className="p-5">Select Status</th>
                  <th className="p-5">Due Date</th>
                  <th className="p-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                {tasks.map((task) => {
                  
                  const isReadyToSubmit = localStatuses[task.id] === "Completed" && task.status !== "Completed";

                  return (
                    <tr key={task.id} className="hover:bg-gray-50/80 transition-all">
                      <td className="p-5">
                        <p className="font-bold text-gray-800">{task.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{task.description}</p>
                        {task.github_url && (
                          <a 
                            href={task.github_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center text-[11px] text-[#5A52E5] font-semibold mt-1 hover:underline"
                          >
                            🔗 View Submitted Work
                          </a>
                        )}
                      </td>
                      
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-50 text-[#5A52E5] rounded-full flex items-center justify-center text-[10px] font-bold">
                            {task.assigned_user_name ? task.assigned_user_name.substring(0, 2).toUpperCase() : "UN"}
                          </div>
                          <span className="font-medium text-xs text-gray-600">
                            {task.assigned_user_name || "Unassigned"}
                          </span>
                        </div>
                      </td>

                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          task.priority === "High" ? "bg-red-50 text-red-600" :
                          task.priority === "Medium" ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"
                        }`}>
                          {task.priority}
                        </span>
                      </td>

                      <td className="p-5">
                        <select
                          value={localStatuses[task.id] || "To Do"}
                          onChange={(e) => handleDropdownChange(task.id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-100 outline-none cursor-pointer bg-white"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      <td className="p-5 text-gray-400 text-xs">
                        {new Date(task.due_date).toLocaleDateString()}
                      </td>

                     
                      <td className="p-5 text-center">
                        <button
                          onClick={() => handleSubmitStatus(task.id)}
                          disabled={!isReadyToSubmit}
                          className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer ${
                            isReadyToSubmit 
                              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/10" // Completed निवडल्यावर डार्क निळा
                              : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" // In Progress किंवा To Do ला लॉक
                          }`}
                        >
                          Submit Work
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Popup (Same as before) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Create New Task</h2>
              <p className="text-xs text-gray-400 mb-6">Assign a new task to the workspace.</p>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Select Project</label>
                  <select
                    value={newTask.project_id}
                    onChange={(e) => setNewTask({ ...newTask, project_id: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none text-sm text-gray-700 cursor-pointer"
                    required
                  >
                    <option value="">-- Choose Project --</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Assign To (Team Member)</label>
                  <select
                    value={newTask.assigned_to}
                    onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none text-sm text-gray-700 cursor-pointer"
                    required
                  >
                    <option value="">-- Choose Team Member --</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.role || "Developer"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Task Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Design Dashboard UI"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none text-sm text-gray-700 placeholder-gray-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Description</label>
                  <textarea
                    placeholder="Brief details about the task..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none text-sm text-gray-700 placeholder-gray-300 h-20 resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-700 cursor-pointer"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Due Date</label>
                    <input
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-700"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-1/2 bg-gray-100 text-gray-600 text-sm font-bold py-3.5 rounded-2xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-[#5A52E5] text-white text-sm font-bold py-3.5 rounded-2xl transition-all shadow-md cursor-pointer"
                  >
                    Create Task
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

export default Tasks;