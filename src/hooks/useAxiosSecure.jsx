import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import auth from '../firebase/firebase.config';
import { useSignOut } from 'react-firebase-hooks/auth';

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000',
});

const useAxiosSecure = () => {
    const [signOut] = useSignOut(auth);
    const navigate = useNavigate();

    useEffect(() => {
        axiosSecure.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    await signOut();
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );
    }, [signOut, navigate]);

    return [axiosSecure];
};

export default useAxiosSecure;
