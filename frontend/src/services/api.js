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


export const loginUser = async (email, password) => {
  const response = await API.post("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (name, email, password, role = "user") => {
  const response = await API.post("/auth/register", { name, email, password, role });
  return response.data;
};

export const getProjects = async () => {
  const response = await API.get("/projects");
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await API.post("/projects", projectData);
  return response.data;
};

export default API;