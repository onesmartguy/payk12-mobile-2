import Constants from 'expo-constants';

type Environment = {
    environmentName: string;
    apiHost: string;
    appPrimaryColor: string;
}
// Access environment-specific variables
const envs = ((Constants.expoConfig?.extra || {}) as Environment);
export const { environmentName, apiHost, appPrimaryColor } = envs;
console.log(`Constants (extras)`, envs);

export default envs;


