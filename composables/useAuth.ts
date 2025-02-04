// composables/useAuth.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useCookie, useRouter } from 'nuxt/app';

interface UserData {
  id?: string;
  email: string;
  fullName: string;
  userType: 'admin' | 'producer' | 'buyer' | 'transport';
  role: string;
  status: 'active' | 'inactive';
  avatarUrl?: string;
  phone?: string;
  entityType?: string;
}

interface AuthState {
  token: string | null;
  user: UserData | null;
  loading: boolean;
}

export const useAuth = defineStore('auth', () => {
  const state = ref<AuthState>({
    token: useCookie('auth_token').value ?? null,
    user: null,
    loading: false,
  });

  const isAuthenticated = computed(() => !!state.value.token && !!state.value.user);
  const router = useRouter();

  // Helper function to get headers with authorization token
  function getAuthHeaders() {
    const token = state.value.token;
    return token 
      ? { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' 
        } 
      : { 'Content-Type': 'application/json' };
  }

  async function login(email: string, password: string) {
    try {
      state.value.loading = true;

      // Appel à l'API de connexion
      const response = await $fetch<{ token: string; user: UserData }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });

      if (!response || !response.token) {
        throw new Error('Token invalide');
      }

      // Mise à jour de l'état
      state.value.token = response.token;
      state.value.user = response.user;

      // Stockage du token dans un cookie
      const tokenCookie = useCookie('auth_token');
      tokenCookie.value = response.token;

      // Redirection en fonction du rôle
      const redirectPath = getRedirectPath(response.user);
      await router.push(redirectPath);

      return response;
    } catch (error: any) {
      state.value.token = null;
      state.value.user = null;
      const tokenCookie = useCookie('auth_token');
      tokenCookie.value = null;
      throw error;
    } finally {
      state.value.loading = false;
    }
  }

  function getRedirectPath(user: UserData): string {
    if (user.role === 'admin') {
      return '/admin/dashboard';
    } else if (user.userType === 'producer') {
      return '/dashboard/SellerDashboard';
    } else {
      return '/dashboard/BuyerDashboard';
    }
  }

  function logout() {
    state.value.token = null;
    state.value.user = null;
    const tokenCookie = useCookie('auth_token');
    tokenCookie.value = null;
    router.push('/');
  }

  return {
    state,
    isAuthenticated,
    login,
    logout,
    getAuthHeaders, // Expose the headers helper function
  };
});