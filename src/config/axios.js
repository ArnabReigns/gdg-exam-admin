import axios from "axios";

console.log(import.meta.env.VITE_BACKEND_URL)

const api = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL + "/api/v1/admin", // Replace with your base URL
	params: {
		a_email: "aritra@gdgoctiu.com", // Add default email parameter
		a_pass: "RJiQ$jwzeOQrR$z9", // Add default password parameter
	},
	timeout: 10000, // Optional timeout in milliseconds
	headers: {
		"Content-Type": "application/json", // Default headers
	},
});

export default api;
