import { useMutation } from 'react-query';
import useSessionStore from '@/stores/useSessionStore';
import { loginUser } from '@/api/auth';

const useLogin = () => {
  const login = useSessionStore((state) => state.login);

  return useMutation(({ username, password }: { username: string; password: string }) =>
    loginUser({ username, password })
      .then(async response => {
        return await login(response.data);
      })
  );
};

export default useLogin;