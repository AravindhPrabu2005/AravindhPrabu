import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://wheurn6wyf.execute-api.eu-north-1.amazonaws.com/dev',  
});
// render url : https://aravindhprabu-portfolio.onrender.com
// aws url : https://wheurn6wyf.execute-api.eu-north-1.amazonaws.com/dev

export default axiosInstance