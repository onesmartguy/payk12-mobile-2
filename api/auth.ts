import axios from './axios';

type LoginPayload = {
    username: string;
    password: string
}
export const loginUser = async (credentials: LoginPayload) => {
  return await axios.post<string>(`/auth/token`, credentials);
};

