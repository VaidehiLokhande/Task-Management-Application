import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // १. LocalStorage मधून लॉगिन असलेल्या युझरचा डेटा सुरक्षितपणे वाचणे
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const userRole = user?.role || "user"; // जर रोल नसेल तर बाय-डिफॉल्ट 'user'

  const isActive = (path) => location.pathname === path;

  // २. सर्व पेजेसची मास्टर लिस्ट (इथे आपण 'isAdminOnly' फ्लॅग वापरला आहे)
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊", isAdminOnly: false },
    { name: "Projects", path: "/projects", icon: "📁", isAdminOnly: false },
    { name: "Tasks", path: "/tasks", icon: "📋", isAdminOnly: false },
    { name: "Kanban Board", path: "/kanban", icon: "🗂️", isAdminOnly: false },
    { name: "Calendar", path: "/calendar", icon: "📅", isAdminOnly: false },
    { name: "Team", path: "/team", icon: "👥", isAdminOnly: true }, // 🔒 फक्त ॲडमिनसाठी
    { name: "Notifications", path: "/notifications", icon: "🔔", isAdminOnly: false },
    { name: "Profile", path: "/profile", icon: "👤", isAdminOnly: false },
    { name: "Settings", path: "/settings", icon: "⚙️", isAdminOnly: false },
  ];

  // ३. युझरच्या रोलनुसार मेन्यू आयटम्स फिल्टर करणे
  const filteredMenuItems = menuItems.filter(item => {
    if (item.isAdminOnly && userRole !== "admin") {
      return false; // जर पेज फक्त ॲडमिनसाठी असेल आणि लॉगिन युझर 'admin' नसेल, तर ते आयटम काढून टाका
    }
    return true;
  });

  // ४. लॉगआऊट फंक्शन
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // थेट लॉगिन पेजवर पाठवणे
  };

  return (
    <div className="w-64 h-screen bg-[#13151A] text-gray-400 fixed left-0 top-0 flex flex-col justify-between border-r border-gray-800 z-50">
      <div className="p-6">
        
        {/* TaskFlow लोगो */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 bg-[#5A52E5] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-[#5A52E5]/20">
            T
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">TaskFlow</h1>
        </div>

        {/* डायनॅमिक फिल्टर झालेली नेव्हिगेशन लिस्ट */}
        <nav className="flex flex-col gap-1.5">
          {filteredMenuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#5A52E5] text-white shadow-md shadow-[#5A52E5]/20"
                    : "hover:bg-gray-800/50 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* खालचा लॉगआऊट विभाग */}
      <div className="p-6 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
        >
          <span className="text-base">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;