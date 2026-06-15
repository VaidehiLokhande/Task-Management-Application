import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const fetchNotifications = async () => {
    try {
      setLoading(true);
     
      const res = await API.get("/tasks");
      let tasksArr = [];
      
      if (res.data && Array.isArray(res.data.tasks)) {
        tasksArr = res.data.tasks;
      } else if (Array.isArray(res.data)) {
        tasksArr = res.data;
      }

      
      const generatedNotifications = tasksArr.map((task, index) => {
        let type = "info";
        let icon = "🔔";
        let message = `New task "${task.title}" has been assigned to the workspace.`;

        if (task.priority === "High" && task.status !== "Done") {
          type = "urgent";
          icon = "⚠️";
          message = `Urgent: High priority task "${task.title}" requires immediate attention!`;
        } else if (task.status === "Done") {
          type = "success";
          icon = "🎉";
          message = `Great job! Task "${task.title}" has been successfully completed.`;
        }

        return {
          id: task.id || index,
          title: task.priority === "High" ? "High Priority Alert" : task.status === "Done" ? "Task Completed" : "New Task Added",
          message: message,
          time: task.due_date ? `Due: ${new Date(task.due_date).toLocaleDateString()}` : "Recent",
          type: type,
          icon: icon,
          read: false
        };
      });

      setNotifications(generatedNotifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen text-gray-800">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
       
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications</h1>
            <p className="text-xs text-gray-400 mt-0.5">Stay updated with your team's latest activities</p>
          </div>
          {notifications.some(n => !n.read) && (
            <button 
              onClick={markAllAsRead}
              className="text-xs font-bold text-[#5A52E5] hover:text-[#4941CD] bg-[#5A52E5]/5 px-4 py-2.5 rounded-xl transition-all"
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading notifications...</p>
        ) : (
          <div className="max-w-3xl bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-3xl block mb-2">Inbox Empty 📥</span>
                <p className="text-xs text-gray-400 font-medium">You're all caught up! No new notifications.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                    notification.read 
                      ? "bg-gray-50/40 border-gray-100/70 opacity-60" 
                      : notification.type === "urgent"
                      ? "bg-red-50/40 border-red-100/60"
                      : notification.type === "success"
                      ? "bg-green-50/40 border-green-100/60"
                      : "bg-white border-gray-100 shadow-sm hover:shadow-md"
                  }`}
                >
                 
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-base ${
                    notification.type === "urgent" ? "bg-red-50 text-red-500" :
                    notification.type === "success" ? "bg-green-50 text-green-500" : "bg-blue-50 text-blue-500"
                  }`}>
                    {notification.icon}
                  </div>

                 
                  <div className="flex-1">
                    <div className="flex justify-between items-center gap-2">
                      <h3 className={`text-sm font-bold ${notification.type === "urgent" ? "text-red-950" : "text-gray-800"}`}>
                        {notification.title}
                      </h3>
                      <span className="text-[10px] text-gray-400 font-medium">{notification.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notification.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;