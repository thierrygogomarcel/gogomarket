import axios from 'axios';
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'; // Utilisez #imports pour éviter les erreurs d'alias
import { useAuth } from '~/composables/useCustomAuth';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const auth = useAuth();

  // Vérifiez que `config.public.apiBase` est bien défini
  if (!config.public.apiBase) {
    throw new Error('La configuration `apiBase` est manquante dans `runtimeConfig.public`.');
  }

  const axiosInstance = axios.create({
    baseURL: config.public.apiBase as string, // Forcer le typage en `string`
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Ajouter le token d'authentification aux requêtes
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = auth.state.token;
      if (token && typeof token === 'string') {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Gérer les erreurs d'authentification
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        auth.logout();
      }
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      axios: axiosInstance,
    },
  };
});