import React, { useState } from 'react';
import { View, Text, Modal, Pressable, ScrollView, Platform } from 'react-native';
import { permissionsManager, PermissionStatus } from '@/lib/permissions-manager';
import type { PermissionType } from '@/lib/permissions-manager';

interface PermissionItem {
  type: PermissionType;
  title: string;
  description: string;
  icon: string;
  required: boolean;
}

const REQUIRED_PERMISSIONS: PermissionItem[] = [
  {
    type: 'CAMERA',
    title: 'Camera',
    description: 'Required to scan QR codes for multiplayer connections',
    icon: '📷',
    required: true,
  },
  {
    type: 'MICROPHONE',
    title: 'Microphone',
    description: 'Used for voice communication in multiplayer mode',
    icon: '🎤',
    required: true,
  },
  {
    type: 'MEDIA_LIBRARY',
    title: 'Photos & Media',
    description: 'To save and load game screenshots and recordings',
    icon: '🖼️',
    required: false,
  },
];

interface PermissionModalProps {
  visible: boolean;
  onComplete: (allGranted: boolean) => void;
}

export function PermissionModal({ visible, onComplete }: PermissionModalProps) {
  const [statuses, setStatuses] = useState<Record<PermissionType, PermissionStatus>>({
    CAMERA: PermissionStatus.UNDETERMINED,
    MICROPHONE: PermissionStatus.UNDETERMINED,
    MEDIA_LIBRARY: PermissionStatus.UNDETERMINED,
    NETWORK_STATE: PermissionStatus.UNDETERMINED,
  });
  const [loading, setLoading] = useState(false);

  const handleRequestPermissions = async () => {
    if (Platform.OS === 'web') {
      onComplete(true);
      return;
    }

    setLoading(true);
    try {
      const results = await permissionsManager.requestMultiplePermissions([
        'CAMERA',
        'MICROPHONE',
        'MEDIA_LIBRARY',
      ]);

      setStatuses((prev) => ({ ...prev, ...results }));

      // Check if all required permissions are granted
      const requiredGranted = REQUIRED_PERMISSIONS.filter((p) => p.required).every(
        (p) => permissionsManager.isPermissionGranted(results[p.type])
      );

      if (requiredGranted) {
        setTimeout(() => onComplete(true), 500);
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: PermissionStatus): string => {
    switch (status) {
      case PermissionStatus.GRANTED:
        return '#22c55e';
      case PermissionStatus.DENIED:
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

  const getStatusText = (status: PermissionStatus): string => {
    switch (status) {
      case PermissionStatus.GRANTED:
        return '✓ Granted';
      case PermissionStatus.DENIED:
        return '✗ Denied';
      default:
        return 'Not requested';
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-background rounded-2xl p-6 w-full max-w-sm shadow-lg">
          {/* Header */}
          <Text className="text-2xl font-bold text-foreground mb-2">
            App Permissions
          </Text>
          <Text className="text-sm text-muted mb-6">
            Survival Shooter 3D needs these permissions to work properly
          </Text>

          {/* Permission List */}
          <ScrollView className="mb-6 max-h-80">
            {REQUIRED_PERMISSIONS.map((permission) => (
              <View
                key={permission.type}
                className="flex-row items-start gap-3 mb-4 p-3 bg-surface rounded-lg border border-border"
              >
                <Text className="text-2xl">{permission.icon}</Text>
                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-base font-semibold text-foreground">
                      {permission.title}
                    </Text>
                    {permission.required && (
                      <Text className="text-xs bg-error text-white px-2 py-1 rounded">
                        Required
                      </Text>
                    )}
                  </View>
                  <Text className="text-xs text-muted mb-2">
                    {permission.description}
                  </Text>
                  <Text
                    className="text-xs font-medium"
                    style={{ color: getStatusColor(statuses[permission.type]) }}
                  >
                    {getStatusText(statuses[permission.type])}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Info Box */}
          <View className="bg-warning/10 border border-warning rounded-lg p-3 mb-6">
            <Text className="text-xs text-warning font-medium">
              ⚠️ You can change these permissions later in your device settings.
            </Text>
          </View>

          {/* Buttons */}
          <View className="gap-3">
            <Pressable
              onPress={handleRequestPermissions}
              disabled={loading}
              style={({ pressed }) => ({
                backgroundColor: loading ? '#9ca3af' : '#0a7ea4',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text className="text-white text-center font-semibold">
                {loading ? 'Requesting...' : 'Request Permissions'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onComplete(false)}
              style={({ pressed }) => ({
                backgroundColor: '#666666',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text className="text-white text-center font-semibold">
                Continue Without Permissions
              </Text>
            </Pressable>
          </View>

          {/* Note */}
          <Text className="text-xs text-muted text-center mt-4">
            Some features may not work without permissions
          </Text>
        </View>
      </View>
    </Modal>
  );
}
