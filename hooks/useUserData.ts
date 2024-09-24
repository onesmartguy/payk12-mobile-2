// useUserData.ts
import { useQuery } from 'react-query';
import api from '../api/base';
import { useAuthStore } from '../stores/sessionStore';

export const useUserData = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery('userData', async () => {
    const response = await api.get('/user');
    setUser(response.data);
    return response.data;
  }, {
    enabled: !!useAuthStore.getState().jwt, // Only fetch if JWT exists
  });
};