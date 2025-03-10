import axios from "axios";
import { errorHandler } from './errorHandler';

const axiosReq = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosReq.interceptors.response.use(
    (response) => response,
    (error) => {
        errorHandler(error);

        return Promise.reject(error);
    }
);

export default axiosReq;