import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// 🟢 खालील फंक्शन्स तुमच्या फाईलमध्ये जोडून घ्या:

// १. लॉगिन करण्यासाठी
export const loginUser = async (email, password) => {
  const response = await API.post("/auth/login", { email, password });
  return response.data;
};

// २. रजिस्टर करण्यासाठी
export const registerUser = async (name, email, password, role = "user") => {
  const response = await API.post("/auth/register", { name, email, password, role });
  return response.data;
};

// ३. प्रोजेक्ट्सची लिस्ट आणण्यासाठी
export const getProjects = async () => {
  const response = await API.get("/projects");
  return response.data;
};

// ४. नवीन प्रोजेक्ट तयार करण्यासाठी (फक्त ॲडमिनसाठी)
export const createProject = async (projectData) => {
  const response = await API.post("/projects", projectData);
  return response.data;
};

export default API;