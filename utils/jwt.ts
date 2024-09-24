import { decode  } from 'jsonwebtoken';
import { isBefore, fromUnixTime } from 'date-fns';
import { DecodedToken } from '@/types';



/**
 * Decode the JWT token to extract user info and expiration.
 * @param token - The JWT token as a string
 * @returns Decoded token object containing user info and expiration
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded = decode(token) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Failed to decode token', error);
    return null;
  }
};

/**
 * Check if the token is expired using date-fns for time comparison.
 * @param token - The JWT token as a string
 * @returns `true` if the token is expired, otherwise `false`
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;  // If decoding fails or no exp field is present, treat the token as expired
  }

  const expirationTime = fromUnixTime(decoded.exp);  // Convert expiration time from UNIX timestamp to Date
  return isBefore(expirationTime, new Date());       // Check if the current time is after the expiration time
};