import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://aravindhprabu-portfolio.onrender.com',  
});
// aws url : https://dzc0ibd8dc.execute-api.ap-south-1.amazonaws.com/dev
// local url: http://localhost:5000
// render url: https://aravindhprabu-portfolio.onrender.com

export default axiosInstance