import Box from '@/common/components/Box';
import Button from '@/common/components/Button';
import TextView from '@/common/components/TextView';
import React from 'react';
import { Modal } from 'react-native';

interface PermissionModalProps {
  visible: boolean;
  onRequestPermission: () => void;
  onClose: () => void;
}

export default function PermissionExplanationModal({ visible, onRequestPermission, onClose }: PermissionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <Box flex={1}>
        <Box>
          <TextView>Camera Permission Required</TextView>
          <TextView>
            This app requires access to your camera to take photos. Please grant camera permission to continue using this feature.
          </TextView>
          <Button label="Grant Permission" onPress={onRequestPermission} />
          <Button label="Close" onPress={onClose} />
        </Box>
      </Box>
    </Modal>
  );
}