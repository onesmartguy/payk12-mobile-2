import { DecodedToken, UserProfile } from '@/types';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';


type SessionStore = {
    user: UserProfile | null;
    id: string | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    expiresAt: number | null;
    login: (token: string) => Promise<UserProfile>;
    logout: () => void;
    permissions: string[]
};

const decodeJwt = async (token: string): Promise<DecodedToken | undefined> => {
    console.log('Decoding JWT:', {token})
    if(!token) return undefined;
    const jwtSession = jwtDecode<DecodedToken>(token);
    return jwtSession
}
const defaults = { user: null, token: null, isAuthenticated: false, id: null, refreshToken: null, expiresAt: null, permissions: [] }
const useSessionStore = create<SessionStore>((set, get) => ({...defaults,
  login: async (token: any) => {
    try {
      var tokenData = await decodeJwt(token)
      if (!tokenData) {
        throw new Error('Could not decode token')
      }
      var user = {
        id: Number(tokenData.id),
        username: tokenData.email,
        email: tokenData.email,
        firstName: tokenData.fn,
        lastName: tokenData.ln,
        displayName: tokenData.name,
        tenantId: tokenData.tid,
        schoolId: tokenData.sid,
        role: {id: tokenData.rid, name: tokenData.rln},
      } as UserProfile

      const permissions = [
        'canShareTickets',
        'canRedeemTickets'
      ]
      console.log('login user', { user, token, id: tokenData.id, expiresAt: tokenData.exp, permissions })
      set({ user, token, id: tokenData.id, expiresAt: tokenData.exp, permissions, isAuthenticated: true })

      return user
    } catch (error) {
      throw new Error('Could not decode token')
    }
 
    
  },
  logout: () => set(defaults),
}));

export default useSessionStore;