import axios from 'axios';

const baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://api.aravindhprabu.me/';

const axiosInstance = axios.create({
    baseURL: baseURL,
});

export default axiosInstance;