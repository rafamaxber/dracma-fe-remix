import axios from 'axios';

export const dracmaApiClient = axios.create({
  baseURL: process.env.DRACMA_API_URL,
});
