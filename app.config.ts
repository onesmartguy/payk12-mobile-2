import 'dotenv/config'; // Load .env files
import { ExpoConfig, ConfigContext } from '@expo/config';
const { withAndroidManifest } = require('@expo/config-plugins');
// Default Expo configuration based on the environment
export default ({ config }: ConfigContext): ExpoConfig => {
    const ENV = process.env.APP_ENV || 'development'; // Set environment mode (default: 'development')
    config.name = ENV === 'production' ? 'PayK12 Box Office' : 'PayK12 Box Office (Dev)';
    config.slug = 'payk12-box-office'
    config.version = '1.0.0'
    config.userInterfaceStyle = 'automatic'
    // config.splash = {
    //     image: './assets/images/splash.png',
    //     resizeMode: 'contain',
    //     backgroundColor: '#ffffff',
    // }
    config.extra = {
        apiHost: process.env.API_HOST,
        appPrimaryColor: process.env.APP_PRIMARY_COLOR,
        environmentName: ENV,
    }
    config.android = {
        package: ENV === 'production' ? 'com.payk12.ticketmanager' : 'com.payk12.ticketmanager.dev',
    }
    config.ios = {
        bundleIdentifier: ENV === 'production' ? 'com.payk12.ticketmanager' : 'com.payk12.ticketmanager.dev',
        infoPlist: {
            LSApplicationQueriesSchemes: ["https", "http"],
            NSCameraUsageDescription: 'Allow $(PRODUCT_NAME) to access your camera',
            NSMicrophoneUsageDescription: 'Allow $(PRODUCT_NAME) to access your microphone',
            NSFaceIDUsageDescription: 'Allow $(PRODUCT_NAME) to access your Face ID biometric data.',
        },
    }
    config.plugins = [
        "expo-router",
        [
            "expo-camera",
            {
                "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
                "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
                "recordAudioAndroid": true
            }
        ],
        [
            "expo-secure-store",
            {
                "faceIDPermission": "Allow $(PRODUCT_NAME) to access your Face ID biometric data."
            }
        ]]

    return withAndroidManifest(config, async (cfg: Partial<ExpoConfig>) => {
        return cfg;
    });
};