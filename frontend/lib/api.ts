import axios from "axios";
import env from "dotenv";
const rawBaseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
export const api = axios.create({
  baseURL,
  timeout: 30000,
});
