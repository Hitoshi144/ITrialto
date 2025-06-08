import axios from 'axios';
import { getTokenFromLocalStorage } from 'src/helpers/localstorage.helper';

export const instance = axios.create({
  baseURL: 'https://itrialto.onrender.com',
});

instance.interceptors.request.use((config) => {
  const token = getTokenFromLocalStorage(); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});