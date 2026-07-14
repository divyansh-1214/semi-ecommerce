import axios from "axios";

const rawBaseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
// Clean up any potential quotes or whitespace from the environment variable, defaulting to localhost:5000
const baseURL = rawBaseURL ? rawBaseURL.replace(/['"]/g, "").trim() : "http://localhost:5000";

export const api = axios.create({
    baseURL,
    timeout: 5000,
    headers: { "X-Custom-Header": "foobar" },
})
