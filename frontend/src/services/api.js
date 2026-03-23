import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getSkills = () => api.get('/skills');
export const createSkill = (skillData) => api.post('/skills', skillData);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);
export const updateSkill = (id, skillData) => api.put(`/skills/${id}`, skillData);

export const getAnalytics = () => api.get('/analytics');

export const getUsers = () => api.get('/users');
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const updateUserRole = (id, role) => api.put(`/users/${id}/role`, { role });

export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id) => api.put(`/notifications/${id}`);

export const assignFaculty = (staffId) => api.post('/auth/assign-faculty', { staffId });
export const getFacultyStudents = () => api.get('/auth/faculty-students');
export const getMyFaculty = () => api.get('/auth/my-faculty');
export const getRank = () => api.get('/auth/rank');

export const getMessages = (userId) => api.get(`/messages/${userId}`);
export const sendMessage = (receiverId, text) => api.post('/messages', { receiverId, text });

export default api;
