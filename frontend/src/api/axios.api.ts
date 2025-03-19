import axios from 'axios';
import { getTokenFromLocalStorage } from 'src/helpers/localstorage.helper';

export const instance = axios.create({
  baseURL: 'http://localhost:3001',
});

instance.interceptors.request.use((config) => {
  const token = getTokenFromLocalStorage(); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});