import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      onScan(data);
      // Reset after 1 second to allow multiple scans
      setTimeout(() => setScanned(false), 1000);
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-center">Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-black p-4">
        <Text className="text-white text-center mb-4">
          Camera permission is required to scan QR codes
        </Text>
        <Pressable
          onPress={requestPermission}
          style={({ pressed }) => ({
            backgroundColor: '#0a7ea4',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
        enableTorch={torch}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        {/* Scanner Overlay */}
        <View className="flex-1 justify-center items-center">
          {/* Scanning Frame */}
          <View
            style={{
              width: 250,
              height: 250,
              borderWidth: 2,
              borderColor: '#0a7ea4',
              borderRadius: 12,
              backgroundColor: 'rgba(10, 126, 164, 0.1)',
            }}
          >
            {/* Corner Markers */}
            <View
              style={{
                position: 'absolute',
                top: -8,
                left: -8,
                width: 30,
                height: 30,
                borderTopWidth: 3,
                borderLeftWidth: 3,
                borderColor: '#0a7ea4',
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                width: 30,
                height: 30,
                borderTopWidth: 3,
                borderRightWidth: 3,
                borderColor: '#0a7ea4',
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -8,
                left: -8,
                width: 30,
                height: 30,
                borderBottomWidth: 3,
                borderLeftWidth: 3,
                borderColor: '#0a7ea4',
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -8,
                right: -8,
                width: 30,
                height: 30,
                borderBottomWidth: 3,
                borderRightWidth: 3,
                borderColor: '#0a7ea4',
              }}
            />
          </View>

          {/* Scanning Text */}
          <Text className="text-white text-center mt-8 font-semibold">
            {scanned ? '✓ QR Code Detected!' : 'Point camera at QR code'}
          </Text>
        </View>

        {/* Controls */}
        <View className="absolute bottom-0 left-0 right-0 flex-row justify-between items-center p-4 bg-black/50">
          <Pressable
            onPress={() => setTorch(!torch)}
            style={({ pressed }) => ({
              backgroundColor: torch ? '#0a7ea4' : '#666666',
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text className="text-white font-semibold">
              {torch ? '🔦 Torch On' : '🔦 Torch Off'}
            </Text>
          </Pressable>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => ({
              backgroundColor: '#ef4444',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text className="text-white font-semibold">Close</Text>
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}
