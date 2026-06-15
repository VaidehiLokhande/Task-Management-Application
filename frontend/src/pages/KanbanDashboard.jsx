import { useState, useEffect } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

function KanbanDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. डेटाबेस मधून टास्क्स लोड करणे
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error("Error fetching tasks for Kanban Dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. जेव्हा स्टेटस बदलून "To Do", "In Progress", किंवा "Completed" होईल
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // आपण बॅकएंडला बनवलेला सुरक्षित /tasks/:id/status रूट
      const res = await API.put(`/tasks/${taskId}/status`, {
        status: newStatus,
      });

      if (res.data.success) {
        // फ्रंटएंड स्टेट लगेच अपडेट करायची (Real-time update)
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("You can only update your own tasks!"); // सिक्युरिटी अलर्ट
    }
  };

  // टास्क्स फिल्टर करणे (Columns साठी)
  const todoTasks = tasks.filter((t) => t.status === "To Do");
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress");
  const doneTasks = tasks.filter((t) => t.status === "Completed" || t.status === "Done");

  if (loading) return <div className="p-8">Loading Kanban Dashboard...</div>;

  return (
    <div className="flex bg-[#F9FAFB] min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-800">Kanban Board</h1>
          <p className="text-gray-500 text-sm">Drag, drop and track your task workflow visually</p>
        </div>
        
        {/* Kanban Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* TO DO COLUMN */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">TO DO</h3>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {todoTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {todoTasks.map((task) => (
                <div key={task.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group">
                  <span className="text-[10px] uppercase font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
                    {task.priority || "Medium"}
                  </span>
                  <h4 className="font-bold text-sm text-gray-800 mt-2">{task.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                  
                  {/* स्टेटस चेंज करण्यासाठी क्विक ॲक्शन बटन */}
                  <div className="mt-3 flex justify-end">
                    <button 
                      onClick={() => handleStatusChange(task.id, "In Progress")}
                      className="text-[11px] bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg font-medium transition-all"
                    >
                      Start Progress ➡️
                    </button>
                  </div>
                </div>
              ))}
              {todoTasks.length === 0 && (
                <p className="text-center text-xs text-gray-400 py-4">No tasks in this stage</p>
              )}
            </div>
          </div>

          {/* IN PROGRESS COLUMN */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">IN PROGRESS</h3>
              <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {inProgressTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <div key={task.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                    {task.priority || "Medium"}
                  </span>
                  <h4 className="font-bold text-sm text-gray-800 mt-2">{task.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <button 
                      onClick={() => handleStatusChange(task.id, "To Do")}
                      className="text-[11px] text-gray-500 hover:underline"
                    >
                      ⏪ Move Back
                    </button>
                    <button 
                      onClick={() => handleStatusChange(task.id, "Completed")}
                      className="text-[11px] bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 rounded-lg font-medium transition-all"
                    >
                      Complete ✔️
                    </button>
                  </div>
                </div>
              ))}
              {inProgressTasks.length === 0 && (
                <p className="text-center text-xs text-gray-400 py-4">No tasks in this stage</p>
              )}
            </div>
          </div>

          {/* DONE COLUMN */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">DONE</h3>
              <span className="bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {doneTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {doneTasks.map((task) => (
                <div key={task.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 opacity-75">
                  <span className="text-[10px] uppercase font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    Finished
                  </span>
                  <h4 className="font-bold text-sm text-gray-400 line-through mt-2">{task.title}</h4>
                  <p className="text-xs text-gray-400 line-through mt-1">{task.description}</p>
                  
                  <div className="mt-3 flex justify-start">
                    <button 
                      onClick={() => handleStatusChange(task.id, "In Progress")}
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      🔄 Re-open Task
                    </button>
                  </div>
                </div>
              ))}
              {doneTasks.length === 0 && (
                <p className="text-center text-xs text-gray-400 py-4">No tasks in this stage</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default KanbanDashboard;