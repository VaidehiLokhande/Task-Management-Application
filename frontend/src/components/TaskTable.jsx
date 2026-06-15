import React from 'react';

function TaskTable() {
  const tasks = [
    {
      id: 1,
      title: "Design Doctor Dashboard UI",
      project: "Remote Rehab AI",
      dueDate: "15 Jun 2026",
      priority: "High",
      status: "In Progress"
    },
    {
      id: 2,
      title: "Fix Tailwind v4 Styles",
      project: "TaskFlow",
      dueDate: "18 Jun 2026",
      priority: "Medium",
      status: "Pending"
    },
    {
      id: 3,
      title: "Integrate IMU Prediction API",
      project: "IMU Exercise Tracker",
      dueDate: "20 Jun 2026",
      priority: "High",
      status: "Pending"
    },
    {
      id: 4,
      title: "Setup PostgreSQL Database",
      project: "TaskFlow Backend",
      dueDate: "25 Jun 2026",
      priority: "Low",
      status: "Completed"
    }
  ];

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-600';
      case 'Medium': return 'bg-amber-50 text-amber-600';
      case 'Low': return 'bg-green-50 text-green-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
        <h3 className="text-lg font-bold text-gray-800">Recent Tasks</h3>
        <button className="text-xs font-semibold text-[#5A52E5] hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
              <th className="py-3 px-6">Task Name</th>
              <th className="py-3 px-6">Project</th>
              <th className="py-3 px-6">Due Date</th>
              <th className="py-3 px-6">Priority</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50/70 transition-colors">
                
                {/* Task Title */}
                <td className="py-4 px-6 font-semibold text-gray-800">
                  {task.title}
                </td>
                
                {/* Project Name */}
                <td className="py-4 px-6 text-gray-500">
                  {task.project}
                </td>
                
                {/* Due Date */}
                <td className="py-4 px-6 text-gray-400 text-xs">
                  {task.dueDate}
                </td>
                
                {/* Priority Badge */}
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getPriorityStyle(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                
                {/* Status Badge */}
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(task.status)}`}>
                    {task.status}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default TaskTable;