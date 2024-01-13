import axios from 'axios';

export const dracmaApiClient = axios.create({
  baseURL: 'http://localhost:4000',
});
