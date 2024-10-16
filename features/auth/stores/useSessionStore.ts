
import { DecodedToken, UserProfile } from '@/common/types';
import { storeToken, removeToken } from '@/utils/storage';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';


type SessionStore = {
    user?: UserProfile;
    id?: string;
    isAuthenticated: boolean;
    token?: string;
    refreshToken?: string;
    expiresAt?: number;
    permissions: string[]
    login: (token: string) => Promise<UserProfile>;
    logout: () => void;
};

const decodeJwt = async (token: string): Promise<DecodedToken | undefined> => {
    console.log('Decoding JWT:', {token})
    if(!token) return undefined;
    const jwtSession = jwtDecode<DecodedToken>(token);
    return jwtSession
}
const defaults = { 
  user: undefined, 
  id: undefined,  
  token: undefined,  
  refreshToken: undefined,  
  isAuthenticated: false, 
  expiresAt: undefined, 
  permissions: [] 
}
const useSessionStore = create<SessionStore>((set, get) => ({...defaults,
  login: async (token: any) => {
    try {
      var tokenData = await decodeJwt(token)
      if (!tokenData) {
        throw new Error('Could not decode token')
      }
      console.log('decoded token', tokenData)
      var user = {
        id: Number(tokenData.uid),
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
      set({ user, id: tokenData.id, expiresAt: tokenData.exp, permissions, token, isAuthenticated: true })
      // await storeToken(token)
      return user
    } catch (error) {
      throw new Error('Could not decode token')
    }
 
    
  },
  logout: async () => {
    // await removeToken()
    set({...defaults})
  }
}));

export default useSessionStore;