import axiosReq from './axios.config';

export const createSession = async () => {
    return axiosReq.post('/session/create')
        .then((res) => {
            return res.data;
        });
}