import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/", 
});

export const loginUser = (data) => API.post("/login/", data);
export const registerUser = (data) => API.post("/register/", data);

export default API;
