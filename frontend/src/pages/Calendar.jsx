import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // कॅलेंडरचे बेसिक स्टाईल्स
import "./CalendarCustom.css"; // आपल्या थीमशी मॅच करण्यासाठी कस्टम स्टाईल्स

function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // १. सुपाबेसमधून सर्व टास्क्स फेच करणे
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks");
      if (res.data && Array.isArray(res.data.tasks)) {
        setTasks(res.data.tasks);
      } else if (Array.isArray(res.data)) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error("Error fetching tasks for calendar:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // २. कॅलेंडरमधील प्रत्येक तारखेवर कोणत्या दिवशी टास्क आहे ते ओळखण्यासाठी डॉट्स (Dots) दाखवणे
 // २. सुरक्षितपणे टास्क्सच्या तारखा मॅच करणे
  const tileContent = ({ date, view }) => {
    if (view === "month" && tasks.length > 0) {
      const localDateStr = date.toLocaleDateString("en-CA"); 
      
      // t.due_date असेल तरच फिल्टर करणार 🛠️
      const dayTasks = tasks.filter(t => t.due_date && new Date(t.due_date).toLocaleDateString("en-CA") === localDateStr);

      if (dayTasks.length > 0) {
        return (
          <div className="flex justify-center gap-0.5 mt-1">
            {dayTasks.slice(0, 3).map((t, idx) => (
              <span 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full ${
                  t.priority === "High" ? "bg-red-500" :
                  t.priority === "Medium" ? "bg-amber-400" : "bg-green-400"
                }`}
              />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  // ३. सिलेक्ट केलेल्या तारखेचे टास्क्स सुरक्षितपणे फिल्टर करणे
  const selectedDateStr = selectedDate.toLocaleDateString("en-CA");
  const filteredTasksForDay = tasks.filter(
    t => t.due_date && new Date(t.due_date).toLocaleDateString("en-CA") === selectedDateStr
  );

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen text-gray-800">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        {/* हेडर */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Workspace Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">Track deadlines and milestones</p>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading your schedule...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* डाव्या बाजूला मुख्य कॅलेंडर */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/30">
              <ReactCalendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                className="w-full border-0 font-sans"
              />
            </div>

            {/* उजव्या बाजूला सिलेक्ट केलेल्या तारखेचे टास्क्स (Deadlines) */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/30 min-h-[400px]">
              <div className="mb-6 border-b border-gray-50 pb-4">
                <h3 className="font-bold text-gray-800 text-lg">Deadlines</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>

              <div className="space-y-3">
                {filteredTasksForDay.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-2xl mb-2">🥳</p>
                    <p className="text-xs text-gray-400 font-medium">No tasks due on this day!</p>
                  </div>
                ) : (
                  filteredTasksForDay.map(task => (
                    <div key={task.id} className="p-4 bg-gray-50/60 rounded-2xl border border-gray-100/50 flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-bold text-gray-800 leading-snug">{task.title}</h4>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          task.priority === "High" ? "bg-red-50 text-red-600" :
                          task.priority === "Medium" ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">{task.description}</p>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100/30 text-[10px] text-gray-400">
                        <span className="bg-[#5A52E5]/5 text-[#5A52E5] font-bold px-2 py-0.5 rounded">
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;