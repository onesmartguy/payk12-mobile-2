
import { loginUser } from '@/api/auth';
import useSessionStore from '../stores/useSessionStore';
import { useMutation } from '@tanstack/react-query';

const useLogin = () => {
  const login = useSessionStore((state) => state.login);

  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) =>
    {
       var resp = await loginUser({ username, password })
       await login(resp.data)
    }
});
};

export default useLogin;