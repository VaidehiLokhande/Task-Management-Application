function Topbar() {
  // LocalStorage मधून लॉगिन असलेल्या युझरचा डेटा मिळवणे
  const user = JSON.parse(localStorage.getItem("user"));
  
  // युझरच्या नावावरून डायनॅमिक अवतार तयार करण्यासाठी URL
  const avatarUrl = user?.name 
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=5A52E5&color=fff&bold=true`
    : "https://ui-avatars.com/api/?name=User&background=5A52E5&color=fff";

  return (
    <div className="w-full bg-white py-3.5 px-6 flex justify-between items-center rounded-2xl border border-gray-100 shadow-xs mb-6">
      
      {/* डावा भाग: वेलकम मेसेज (पहिल्या इमेज सारखा क्लीन लुक) */}
      <div>
        <h2 className="text-lg font-bold text-gray-800">
          Hello, {user?.name || "User"} 👋
        </h2>
        <p className="text-xs text-gray-400">
          Have a productive day ahead!
        </p>
      </div>

      {/* उजवा भाग: प्रोफाइल आणि नोटिफिकेशन्स */}
      <div className="flex items-center gap-4">
        
        {/* युझरची माहिती आणि अवतार */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-700 leading-none">
              {user?.name || "Guest"}
            </p>
            <p className="text-[10px] text-gray-400 mt-1 capitalize">
              {user?.role || "Member"}
            </p>
          </div>
          
          {/* प्रोफाइल इमेज */}
          <img
            src={avatarUrl}
            alt="User Profile"
            className="w-10 h-10 rounded-full border-2 border-[#5A52E5]/20 object-cover"
          />
        </div>

      </div>

    </div>
  );
}

export default Topbar;