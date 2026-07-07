import axios from 'axios';

const getBaseURL = () => {
    // 1. Check if custom environment variable is set
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }

    const hostname = window.location.hostname;

    // 2. If running locally, default to localhost:5000
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
        return 'http://localhost:5000';
    }

    // 3. Strip 'www.' if present
    const cleanHostname = hostname.startsWith('www.') ? hostname.substring(4) : hostname;

    // 4. If it's a domain name, prefix with 'api.'
    if (cleanHostname.includes('.') && !/^[0-9.]+$/.test(cleanHostname)) {
        return `https://api.${cleanHostname}`;
    }

    return `https://${cleanHostname}`;
};

const axiosInstance = axios.create({
    baseURL: getBaseURL(),
});


export default axiosInstance;