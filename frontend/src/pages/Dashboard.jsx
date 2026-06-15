import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

function Dashboard() {
  const getCachedUser = () => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : { id: null, name: "User", role: "User" };
  };

  const cachedUser = getCachedUser();

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const targetUserId = cachedUser.id || cachedUser._id;
        if (!targetUserId) return;

        // बॅकएंडवरून रिअल-टाइम स्टॅट्स मिळवणे
        const res = await API.get(`/tasks/dashboard-stats?userId=${targetUserId}`);
        
        if (res.data.success) {
          setStats(res.data.stats);
          setUpcomingDeadlines(res.data.upcomingDeadlines);

          // 🎯 जर बॅकएंडवरून वीकली डेटा येत असेल तर तो वापरा, नाहीतर हा डिफॉल्ट लेआउट
          if (res.data.weeklyStats) {
            setBarChartData(res.data.weeklyStats);
          } else {
            setBarChartData([
              { name: "Mon", tasks: res.data.stats.completedTasks || 2 },
              { name: "Tue", tasks: 4 },
              { name: "Wed", tasks: 3 },
              { name: "Thu", tasks: 5 },
              { name: "Fri", tasks: 2 },
              { name: "Sat", tasks: 1 },
              { name: "Sun", tasks: 0 },
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard workspace visualization:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // 🎯 फिक्स: इथे 'stats.F59E0B' हा चुकीचा की-नेम काढून फक्त 'stats.pendingTasks' केला आहे
  const pieChartData = [
    { name: "Completed", value: stats.completedTasks, color: "#6366F1" }, // Indigo
    { name: "In Progress", value: stats.inProgressTasks, color: "#10B981" }, // Emerald
    { name: "Pending", value: stats.pendingTasks, color: "#F59E0B" }, // Amber
  ];

  // Custom styling wrapper for interactive chart tooltips
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-2 rounded-xl shadow-xl border border-gray-800">
          <p>{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex bg-[#F8F9FA] min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#5A52E5] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-gray-400 tracking-wide">Loading workspace charts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#F9FAFB] min-h-screen text-gray-800 font-sans antialiased">
      <Sidebar />

      {/* Primary Container View */}
      <div className="flex-1 ml-64 p-8 max-w-[1600px] mx-auto w-full">
        
        {/* Dynamic Top Floating Header with Premium Dropdown look */}
        <div className="bg-white/80 backdrop-blur-md px-8 py-5 rounded-3xl border border-gray-100/80 shadow-sm flex justify-between items-center mb-10 transition-all duration-300">
          <div>
            <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">Hello, {cachedUser.name} 👋</h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Let's check your productivity stream for today.</p>
          </div>
          <div className="flex items-center gap-3.5 bg-gray-50/60 p-1.5 pr-4 rounded-2xl border border-gray-100">
            <div className="w-9 h-9 bg-gradient-to-tr from-[#5A52E5] to-[#7C75EF] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#5A52E5]/20">
              {cachedUser.name ? cachedUser.name.substring(0, 2).toUpperCase() : "US"}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-gray-800 leading-tight">{cachedUser.name}</p>
              <p className="text-[10px] text-gray-400 font-semibold capitalize mt-0.5">{cachedUser.role}</p>
            </div>
          </div>
        </div>

        {/* Section Headline */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
        </div>

        {/* Dynamic Counter Grid with Hover Effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Tasks */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100/70 shadow-sm hover:shadow-md transition-all duration-300 group">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Tasks</p>
            <h3 className="text-3xl font-black text-gray-800 mt-2 tracking-tight group-hover:text-[#5A52E5] transition-colors">{stats.totalTasks}</h3>
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400">
              <span>All Workspace Tasks</span>
              <span className="bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md">Live</span>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100/70 shadow-sm hover:shadow-md transition-all duration-300 group">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</p>
            <h3 className="text-3xl font-black text-green-600 mt-2 tracking-tight">{stats.completedTasks}</h3>
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold">
              <span className="text-gray-400">Performance</span>
              <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-md">Live Sync</span>
            </div>
          </div>

          {/* In Progress Tasks */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100/70 shadow-sm hover:shadow-md transition-all duration-300 group">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">In Progress</p>
            <h3 className="text-3xl font-black text-[#5A52E5] mt-2 tracking-tight">{stats.inProgressTasks}</h3>
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold">
              <span className="text-gray-400">Active Sprint</span>
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">Live Sync</span>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100/70 shadow-sm hover:shadow-md transition-all duration-300 group">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</p>
            <h3 className="text-3xl font-black text-amber-500 mt-2 tracking-tight">{stats.pendingTasks}</h3>
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold">
              <span className="text-gray-400">Remaining</span>
              <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md">Live Sync</span>
            </div>
          </div>
        </div>

        {/* Dynamic Analytics Chart Components Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Task Overview - Clean Pie Chart */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div>
              <h3 className="text-sm font-bold text-gray-800 tracking-tight">Task Overview</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Distribution of workflow states</p>
            </div>
            
            <div className="h-44 w-full relative flex items-center justify-center my-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Metrics Total Indicator */}
              <div className="absolute text-center flex flex-col">
                <span className="text-2xl font-black text-gray-800 tracking-tight">{stats.totalTasks}</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Total</span>
              </div>
            </div>
            
            {/* Legend Indicators with Modern Badges */}
            <div className="space-y-2.5 pt-2 border-t border-gray-50">
              {pieChartData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-500 font-medium">{item.name}</span>
                  </div>
                  <span className="text-gray-800 bg-gray-50 px-2 py-0.5 rounded-md font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks Per Day - Modern Bar Chart */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-800 tracking-tight">Tasks Per Day</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Weekly completion frequency metric</p>
            </div>
            <div className="h-60 w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 5, left: -32, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#9CA3AF" style={{ fontSize: "10px", fontWeight: "600" }} />
                  <YAxis axisLine={false} tickLine={false} stroke="#9CA3AF" style={{ fontSize: "10px", fontWeight: "600" }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8F9FA", radius: 4 }} />
                  <Bar dataKey="tasks" fill="#5A52E5" radius={[5, 5, 0, 0]} barSize={11} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Due Dates - Premium Status Feed */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100/80 shadow-sm hover:shadow-md transition-all duration-300">
            <div>
              <h3 className="text-sm font-bold text-gray-800 tracking-tight">Upcoming Deadlines</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Critical time-sensitive operations</p>
            </div>
            <div className="space-y-3.5 mt-5">
              {upcomingDeadlines.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-xs text-gray-400 font-medium">All caught up! No impending deadlines.</p>
                </div>
              ) : (
                upcomingDeadlines.map((task) => (
                  <div key={task.id} className="flex justify-between items-center p-3 bg-gray-50/50 border border-gray-100/40 rounded-xl hover:border-gray-200/80 transition-all duration-200 group">
                    <div className="max-w-[70%]">
                      <h4 className="text-xs font-bold text-gray-800 truncate group-hover:text-[#5A52E5] transition-colors">{task.title}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{formatDate(task.due_date)}</p>
                    </div>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-sm border ${
                      task.priority === "High" ? "bg-red-50 text-red-500 border-red-100/50" :
                      task.priority === "Medium" ? "bg-amber-50 text-amber-600 border-amber-100/50" : "bg-green-50 text-green-600 border-green-100/50"
                    }`}>
                      <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                      {task.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;