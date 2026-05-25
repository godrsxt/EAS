import { usePermissions as useExpoPermissions } from 'expo-permissions';
import { Platform } from 'react-native';

export type PermissionType = 'CAMERA' | 'MICROPHONE' | 'MEDIA_LIBRARY' | 'NETWORK_STATE';

export enum PermissionStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  UNDETERMINED = 'undetermined',
}

export interface PermissionStatusObj {
  camera: PermissionStatus;
  microphone: PermissionStatus;
  mediaLibrary: PermissionStatus;
}

class PermissionsManager {
  async checkPermission(permission: PermissionType): Promise<PermissionStatus> {
    try {
      if (Platform.OS === 'web') {
        return PermissionStatus.GRANTED;
      }

      // For native, we'll use the hook-based approach via a wrapper
      return PermissionStatus.UNDETERMINED;
    } catch (error) {
      console.error(`Error checking ${permission} permission:`, error);
      return PermissionStatus.UNDETERMINED;
    }
  }

  async requestPermission(permission: PermissionType): Promise<PermissionStatus> {
    try {
      if (Platform.OS === 'web') {
        return PermissionStatus.GRANTED;
      }

      // For native, permissions are requested via hooks in components
      return PermissionStatus.UNDETERMINED;
    } catch (error) {
      console.error(`Error requesting ${permission} permission:`, error);
      return PermissionStatus.DENIED;
    }
  }

  async requestMultiplePermissions(
    permissions: PermissionType[]
  ): Promise<Record<PermissionType, PermissionStatus>> {
    const results: Record<PermissionType, PermissionStatus> = {} as any;

    for (const permission of permissions) {
      const status = await this.requestPermission(permission);
      results[permission] = status;
    }

    return results;
  }

  async checkAllPermissions(): Promise<PermissionStatusObj> {
    if (Platform.OS === 'web') {
      return {
        camera: PermissionStatus.GRANTED,
        microphone: PermissionStatus.GRANTED,
        mediaLibrary: PermissionStatus.GRANTED,
      };
    }

    return {
      camera: PermissionStatus.UNDETERMINED,
      microphone: PermissionStatus.UNDETERMINED,
      mediaLibrary: PermissionStatus.UNDETERMINED,
    };
  }

  isPermissionGranted(status: PermissionStatus): boolean {
    return status === PermissionStatus.GRANTED;
  }
}

export const permissionsManager = new PermissionsManager();
