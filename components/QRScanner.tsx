import { View, Text, StyleSheet } from 'react-native';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  Camera,
  CameraDeviceFormat,
  parsePhysicalDeviceTypes,
  sortFormats,
  useCameraDevices,
} from 'react-native-vision-camera';
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import { BoxProps } from '@shopify/restyle';
import {
  useScanBarcodes,
  BarcodeFormat,
  Barcode,
} from 'vision-camera-code-scanner';

import { Box } from '../ui';
import { Theme } from '../ui/theme';

interface Props extends BoxProps<Theme> {
  onBarcodeFound: (code: BarcodeResult) => any;
}

export const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});
export type BarcodeResult = Barcode;
const QRScanner: React.FC<Props> = ({ onBarcodeFound, ...props }) => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const camera = useRef<Camera>(null);
  const [frameProcessor, barcodes] = useScanBarcodes([
    BarcodeFormat.QR_CODE,
    BarcodeFormat.CODE_39,
  ]);
  const [lastScannedCode, setLastScannedCode] = useState<Barcode | undefined>();
  const [cameraPosition, setCameraPosition] = React.useState<'front' | 'back'>(
    'back',
  );

  const devices = useCameraDevices();
  const device = devices[cameraPosition];
  const formats = useMemo<CameraDeviceFormat[]>(() => {
    if (device?.formats == null) return [];
    return device.formats.sort(sortFormats);
  }, [device?.formats]);

  useEffect(() => {
    if (barcodes.length > 0) {
      if (
        !lastScannedCode ||
        lastScannedCode.rawValue !== barcodes[0].rawValue
      ) {
        const code = barcodes[0];
        setLastScannedCode(code);
        onBarcodeFound(code);
        setTimeout(() => {
          setLastScannedCode(undefined);
        }, 2000);
      }
    }
  }, [barcodes]);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      setHasPermission(cameraPermission === 'authorized');
    })();
  }, []);
  return (
    <Box {...props} flex={1} backgroundColor="bodyText">
      {hasPermission && device && (
        <ReanimatedCamera
          style={{ ...StyleSheet.absoluteFillObject }}
          ref={camera}
          device={device}
          frameProcessor={frameProcessor}
          frameProcessorFps={1}
          focusable
          isActive={!lastScannedCode}
          video
          audio
          photo
        />
      )}
    </Box>
  );
};

export default QRScanner;
