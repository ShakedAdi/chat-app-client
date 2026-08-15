import axios from 'axios';
import type { AxiosInstance } from 'axios';

interface NestErrorBody {
  message?: string | string[];
  statusCode?: number;
  error?: string;
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3000',
  timeout: Number(import.meta.env.VITE_RESPONSE_TIMEOUT) || 10000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError<NestErrorBody>(error)) {
      return Promise.reject(error);
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return Promise.reject(new Error('Server took too long to respond.'));
    }
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject(new Error('Cannot reach the server.'));
    }

    const data = error.response?.data;
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : (data?.message ?? error.message);

    return Promise.reject(new Error(message));
  },
);

export default api;
