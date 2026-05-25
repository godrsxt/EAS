import React, { createContext, useContext, useState, useEffect } from 'react';
import { permissionsManager, PermissionStatus } from './permissions-manager';
import type { PermissionStatusObj } from './permissions-manager';

interface PermissionContextType {
  permissions: PermissionStatusObj;
  requestPermission: (type: 'CAMERA' | 'MICROPHONE' | 'MEDIA_LIBRARY') => Promise<boolean>;
  hasPermission: (type: 'CAMERA' | 'MICROPHONE' | 'MEDIA_LIBRARY') => boolean;
  loading: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const [permissions, setPermissions] = useState<PermissionStatusObj>({
    camera: PermissionStatus.UNDETERMINED,
    microphone: PermissionStatus.UNDETERMINED,
    mediaLibrary: PermissionStatus.UNDETERMINED,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializePermissions();
  }, []);

  const initializePermissions = async () => {
    try {
      const perms = await permissionsManager.checkAllPermissions();
      setPermissions(perms);
    } catch (error) {
      console.error('Error initializing permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestPermission = async (
    type: 'CAMERA' | 'MICROPHONE' | 'MEDIA_LIBRARY'
  ): Promise<boolean> => {
    try {
      const status = await permissionsManager.requestPermission(type);
      const keyMap: Record<string, keyof PermissionStatusObj> = {
        CAMERA: 'camera',
        MICROPHONE: 'microphone',
        MEDIA_LIBRARY: 'mediaLibrary',
      };
      setPermissions((prev) => ({
        ...prev,
        [keyMap[type]]: status,
      }));
      return permissionsManager.isPermissionGranted(status);
    } catch (error) {
      console.error(`Error requesting ${type} permission:`, error);
      return false;
    }
  };

  const hasPermission = (type: 'CAMERA' | 'MICROPHONE' | 'MEDIA_LIBRARY'): boolean => {
    const keyMap: Record<string, keyof PermissionStatusObj> = {
      CAMERA: 'camera',
      MICROPHONE: 'microphone',
      MEDIA_LIBRARY: 'mediaLibrary',
    };
    return permissionsManager.isPermissionGranted(permissions[keyMap[type]]);
  };

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        requestPermission,
        hasPermission,
        loading,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider');
  }
  return context;
}
