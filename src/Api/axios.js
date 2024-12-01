import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5001/clon-1b57e/us-central1/api",
});



export {axiosInstance}