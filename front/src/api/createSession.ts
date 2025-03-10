import axiosReq from './axios.config';

export const createSession = async () => {
    return axiosReq.get('/session/create');
}