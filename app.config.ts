import 'dotenv/config'; // Load .env files
import { ExpoConfig, ConfigContext } from '@expo/config';
const { withAndroidManifest, withInfoPlist } = require('@expo/config-plugins');
// Default Expo configuration based on the environment
export default ({ config }: ConfigContext): ExpoConfig => {
    const ENV = process.env.APP_ENV || 'development'; 

    const GITHUB_RUN_NUMBER = process.env.GITHUB_RUN_NUMBER || '1'; // CI/CD run number
    const versionCode = parseInt(GITHUB_RUN_NUMBER, 10);

    config.slug = 'payk12-box-office'
    config.name = 'PayK12 Box Office';
    config.owner = 'raptortechnologies'
    config.userInterfaceStyle = 'automatic'
    config.version = `1.0.${versionCode}`; // Auto-increment version based on GitHub Actions run number
    // config.splash = {
    //     image: './assets/images/splash.png',
    //     resizeMode: 'contain',
    //     backgroundColor: '#ffffff',
    // };
    config.android = {
        ...config.android,
        package:'com.payk12.ticketmanager',
        versionCode: versionCode, // Android version code must be incremented with each release
        permissions: [
            'CAMERA',
            'RECORD_AUDIO',
            'ACCESS_FINE_LOCATION',
            'ACCESS_COARSE_LOCATION',
            'READ_EXTERNAL_STORAGE',
            'WRITE_EXTERNAL_STORAGE',
            'BLUETOOTH',
            'BLUETOOTH_ADMIN',
            'NFC',
        ],
        intentFilters: [
            {
              action: 'VIEW',
              data: {
                scheme: 'com.payk12.ticketmanager', // Custom scheme for Android
              },
              category: ['BROWSABLE', 'DEFAULT'],
            },
          ],
    };

  
    config.extra = {
        apiUrl: process.env.EXPO_PUBLIC_API_URL,
        siteUrl: process.env.EXPO_PUBLIC_SITE_URL,
        envName: ENV,
        eas: {
            projectId: "8f1f6de6-a4b4-4ab8-87d6-4768cd3db70e"
      }
    }
  
    config.ios = {
        buildNumber: versionCode.toString(),
        bundleIdentifier: 'com.payk12.ticketmanager',
        infoPlist: {
            LSApplicationQueriesSchemes: ["https", "http"],
            NSCameraUsageDescription: 'Allow $(PRODUCT_NAME) to access your camera.',
            NSMicrophoneUsageDescription: 'Allow $(PRODUCT_NAME) to access your microphone.',
            NSFaceIDUsageDescription: 'Allow $(PRODUCT_NAME) to use Face ID for authentication.',
            NSLocationWhenInUseUsageDescription: 'Allow $(PRODUCT_NAME) to access your location when the app is in use.',
            NSLocationAlwaysUsageDescription: 'Allow $(PRODUCT_NAME) to access your location in the background.',
            NSBluetoothAlwaysUsageDescription: 'Allow $(PRODUCT_NAME) to use Bluetooth.',
            NSPhotoLibraryUsageDescription: 'Allow $(PRODUCT_NAME) to access your photo library.',
            NSNFCReaderUsageDescription: 'Allow $(PRODUCT_NAME) to use NFC for ticket scanning.',
            NSPhotoLibraryAddUsageDescription: 'Allow $(PRODUCT_NAME) to save photos to your photo library.',
            CFBundleURLTypes: [
                {
                  CFBundleURLSchemes: ['com.payk12.ticketmanager'], // Unique custom scheme
                },
              ],
        },
        
    }
    
    config.plugins = [
        'expo-router',
        [
            'expo-camera',
            {
                cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera.',
                microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone.',
                recordAudioAndroid: true,
            },
        ],
        [
            'expo-location',
            {
                locationAlwaysAndWhenInUsePermission: {
                    ios: 'Allow $(PRODUCT_NAME) to access your location at all times.',
                    android: {
                        fine: 'Allow $(PRODUCT_NAME) to access precise location.',
                        coarse: 'Allow $(PRODUCT_NAME) to access approximate location.',
                    },
                },
            },
        ],
        [
            'expo-media-library',
            {
                photoLibraryPermission: 'Allow $(PRODUCT_NAME) to access your photo library.',
            },
        ],
        [
            'expo-secure-store',
            {
                faceIDPermission: 'Allow $(PRODUCT_NAME) to use Face ID for authentication.',
            },
        ],
    ];
    return config as ExpoConfig;
};