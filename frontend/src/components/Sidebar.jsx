import { Link, useLocation, useNavigate } from "react-router-dom";
// 🎯 एकाच कलर थीमचे ऑफिशिअल रिॲक्ट आयकॉन्स इंपोर्ट केले आहेत
import { 
  MdDashboard, 
  MdFolder, 
  MdCheckCircle, 
  MdViewKanban, 
  MdCalendarMonth, 
  MdPeople, 
  MdNotifications, 
  MdPerson, 
  MdSettings, 
  MdLogout 
} from "react-icons/md";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // १. LocalStorage मधून लॉगिन असलेल्या युझरचा डेटा सुरक्षितपणे वाचणे
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const userRole = user?.role || "user"; 

  const isActive = (path) => location.pathname === path;

  // २. इमोजी ऐवजी रिॲक्ट आयकॉन्स कम्पोनंट्स मास्टर लिस्टमध्ये जोडले
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <MdDashboard size={20} />, isAdminOnly: false },
    { name: "Projects", path: "/projects", icon: <MdFolder size={20} />, isAdminOnly: false },
    { name: "Tasks", path: "/tasks", icon: <MdCheckCircle size={20} />, isAdminOnly: false },
    { name: "Kanban Board", path: "/kanban", icon: <MdViewKanban size={20} />, isAdminOnly: false },
    { name: "Calendar", path: "/calendar", icon: <MdCalendarMonth size={20} />, isAdminOnly: false },
    { name: "Team", path: "/team", icon: <MdPeople size={20} />, isAdminOnly: true }, // 🔒 फक्त ॲडमिनसाठी
    { name: "Notifications", path: "/notifications", icon: <MdNotifications size={20} />, isAdminOnly: false },
    { name: "Profile", path: "/profile", icon: <MdPerson size={20} />, isAdminOnly: false },
    { name: "Settings", path: "/settings", icon: <MdSettings size={20} />, isAdminOnly: false },
  ];

  // ३. युझरच्या रोलनुसार मेन्यू आयटम्स फिल्टर करणे
  const filteredMenuItems = menuItems.filter(item => {
    if (item.isAdminOnly && userRole !== "admin") {
      return false; 
    }
    return true;
  });

  // ४. लॉगआऊट फंक्शन
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); 
  };

  return (
    <div className="w-64 h-screen bg-[#0F111A] text-gray-400 fixed left-0 top-0 flex flex-col justify-between border-r border-gray-800/60 z-50 shadow-2xl">
      <div className="p-6">
        
        {/* TaskFlow लोगो सेक्शन */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-9 h-9 bg-gradient-to-tr from-[#5A52E5] to-[#7C75EC] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#5A52E5]/20">
            T
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            TaskFlow
          </h1>
        </div>

        {/* डायनॅमिक फिल्टर झालेली नेव्हिगेशन लिस्ट */}
        <nav className="flex flex-col gap-1.5">
          {filteredMenuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? "bg-gradient-to-r from-[#5A52E5] to-[#6E66ED] text-white shadow-lg shadow-[#5A52E5]/20 font-semibold"
                    : "hover:bg-gray-800/40 hover:text-gray-200"
                }`}
              >
                {/* 🎨 आयकॉन्सचा कलर सिंक: ॲक्टिव्ह असताना पूर्ण पांढरा, एरवी ब्रँड पर्पल-ग्रे */}
                <div className={`${active ? "text-white" : "text-gray-500 group-hover:text-[#5A52E5] transition-colors"}`}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* खालचा लॉगआऊट विभाग */}
      <div className="p-6 border-t border-gray-800/40">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
        >
          <div className="text-red-400 group-hover:text-red-300 transition-colors">
            <MdLogout size={20} />
          </div>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;