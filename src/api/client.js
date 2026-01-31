import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRequesting = false;
let setIsLoading = null;

export const setGlobalLoader = (setter) => {
    setIsLoading = setter;
};

client.interceptors.request.use(
    (config) => {
        if (setIsLoading) setIsLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        if (setIsLoading) setIsLoading(false);
        return Promise.reject(error);
    }
);

client.interceptors.response.use(
    (response) => {
        if (setIsLoading) setIsLoading(false);
        return response;
    },
    (error) => {
        if (setIsLoading) setIsLoading(false);
        return Promise.reject(error);
    }
);

export default client;
