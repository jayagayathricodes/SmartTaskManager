import axios from 'axios';
import { Task } from '../interfaces/Task';

const API_BASE_URL = 'http://localhost:5176/api'; // Make sure this matches your backend port

export const api = {
    getTasks: async (): Promise<Task[]> => {
        const response = await axios.get(`${API_BASE_URL}/Task`);
        return response.data;
    },

    createTask: async (task: Task): Promise<Task> => {
        const response = await axios.post(`${API_BASE_URL}/Task`, task);
        return response.data;
    },

    updateTask: async (task: Task): Promise<Task> => {
        const response = await axios.put(`${API_BASE_URL}/Task/${task.id}`, task);
        return response.data;
    },

    deleteTask: async (id: number): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/Task/${id}`);
    }
};