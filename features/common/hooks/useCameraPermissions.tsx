import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';

export const useCameraPermissions = () => {
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);  // Modal visibility state
  
    // Request camera permissions when the hook is used
    useEffect(() => {
      checkCameraPermission();
    }, []);
  
    const checkCameraPermission = async () => {
      const { status } = await Camera.getCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
  
      // If permission is not granted, show the permission explanation modal
      if (status !== 'granted') {
        setShowPermissionModal(true);
      }
    };
  
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const granted = status === 'granted';
      setHasCameraPermission(granted);
  
      // If permission is granted, hide the modal
      if (granted) {
        setShowPermissionModal(false);
      }
    };
  
    const closePermissionModal = () => {
      setShowPermissionModal(false);
    };
  
    return {
      hasCameraPermission,
      requestCameraPermission,
      showPermissionModal,
      closePermissionModal,
    };
  };