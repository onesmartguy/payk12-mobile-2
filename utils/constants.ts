import Constants from 'expo-constants';

type Environment = {
    envName: string;
    version: string;
    apiUrl: string;
    siteUrl: string;
}
// Access environment-specific variables
const envs = ((Constants.expoConfig?.extra || {}) as Environment);
export const { apiUrl, siteUrl, version, envName } = envs;
console.log(`Constants (extras)`, envs);

export default envs;


