// middleware/auth.ts
import { jwtDecode } from 'jwt-decode';
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import { toast } from 'vue3-toastify';

export default defineNuxtRouteMiddleware((to) => {
  // Définir les routes publiques
  const publicRoutes = ['/', '/connexion', '/inscription', '/a-propos'];

  // Si la route est publique, ignorer la vérification
  if (publicRoutes.includes(to.path)) {
    return;
  }

  // Fonction pour récupérer le token JWT
  const getAuthToken = () => {
    const token = localStorage.getItem('auth_token'); // Ou utilisez un cookie
    return token || null;
  };

  // Fonction pour décoder le token et vérifier l'utilisateur
  const getAuthenticatedUser = () => {
    const token = getAuthToken();
    if (!token) return null;

    try {
      // Décoder le JWT pour récupérer les infos utilisateur
      const user = jwtDecode(token);
      return user;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };

  // Récupérer l'utilisateur authentifié
  const user = getAuthenticatedUser();

  // Liste des routes protégées
  const protectedRoutes = ['/dashboard', '/publier'];

  // Vérifier l'accès aux routes protégées
  if (protectedRoutes.includes(to.path) && !user) {
    toast.error('Veuillez vous connecter pour accéder à cette page');
    return navigateTo('/connexion');
  }
});
