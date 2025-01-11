import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Update this to match your Django API URL
    timeout: 5000, // Optional: set a timeout
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default axiosInstance;
