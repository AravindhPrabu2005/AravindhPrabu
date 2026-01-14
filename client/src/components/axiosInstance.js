import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.aravindhprabu.me/',  
});
// aws url : https://api.aravindhprabu.me/
// local url: http://localhost:5000

export default axiosInstance