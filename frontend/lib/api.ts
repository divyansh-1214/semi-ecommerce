import axios from "axios";

const rawBaseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
const baseURL = rawBaseURL
  ? rawBaseURL.replace(/['"]/g, "").trim()
  : "http://localhost:5000";

export const api = axios.create({
  baseURL,
  timeout: 30000,
});
