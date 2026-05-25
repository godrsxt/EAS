import { ScrollView, Text, View, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { QRScanner } from '@/components/qr-scanner';
import { usePermissions } from '@/lib/permission-context';
import QRCode from 'qrcode';

export default function MultiplayerScreen() {
  const router = useRouter();
  const { hasPermission, requestPermission } = usePermissions();
  const [mode, setMode] = useState<'select' | 'host' | 'join' | 'scanning'>('select');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [connectionId, setConnectionId] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'waiting' | 'connected' | 'failed'>('waiting');

  const generateQRCode = async () => {
    try {
      // Generate a unique connection ID
      const id = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setConnectionId(id);

      // Create QR code data with connection offer
      const qrData = JSON.stringify({
        type: 'multiplayer_offer',
        connectionId: id,
        timestamp: Date.now(),
      });

      // Generate QR code as data URL
      const url = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 1,
        width: 300,
      });

      setQrCodeUrl(url as string);
      setConnectionStatus('waiting');
    } catch (error) {
      console.error('Error generating QR code:', error);
      setConnectionStatus('failed');
    }
  };

  const handleStartHost = async () => {
    // Request camera permission if needed
    if (!hasPermission('CAMERA')) {
      const granted = await requestPermission('CAMERA');
      if (!granted) {
        alert('Camera permission is required to host multiplayer games');
        return;
      }
    }

    await generateQRCode();
    setMode('host');
  };

  const handleStartJoin = async () => {
    // Request camera permission
    if (!hasPermission('CAMERA')) {
      const granted = await requestPermission('CAMERA');
      if (!granted) {
        alert('Camera permission is required to scan QR codes');
        return;
      }
    }

    setMode('scanning');
  };

  const handleQRScanned = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === 'multiplayer_offer' && parsed.connectionId) {
        setConnectionId(parsed.connectionId);
        setConnectionStatus('connected');
        setMode('join');
        
        // Auto-start game after 2 seconds
        setTimeout(() => {
          router.push('/game');
        }, 2000);
      } else {
        alert('Invalid QR code. Please scan a valid game connection QR code.');
        setMode('select');
      }
    } catch (error) {
      alert('Failed to parse QR code. Please try again.');
      setMode('select');
    }
  };

  if (mode === 'scanning') {
    return <QRScanner onScan={handleQRScanned} onClose={() => setMode('select')} />;
  }

  if (mode === 'select') {
    return (
      <ScreenContainer className="p-6 bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 gap-8 justify-center items-center">
            {/* Header */}
            <View className="items-center gap-2 mb-4">
              <Text className="text-3xl font-bold text-foreground">
                Local Multiplayer
              </Text>
              <Text className="text-sm text-muted text-center">
                Battle a friend on the same Wi-Fi network
              </Text>
            </View>

            {/* Mode Selection */}
            <View className="gap-4 w-full max-w-sm">
              <Pressable
                onPress={handleStartHost}
                style={({ pressed }) => ({
                  backgroundColor: '#0a7ea4',
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  borderRadius: 12,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text className="text-white text-center font-bold text-lg">
                  Host Game
                </Text>
                <Text className="text-white text-center text-xs mt-1">
                  Generate QR code for opponent
                </Text>
              </Pressable>

              <Pressable
                onPress={handleStartJoin}
                style={({ pressed }) => ({
                  backgroundColor: '#ff6b35',
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  borderRadius: 12,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Text className="text-white text-center font-bold text-lg">
                  Join Game
                </Text>
                <Text className="text-white text-center text-xs mt-1">
                  Scan opponent's QR code
                </Text>
              </Pressable>
            </View>

            {/* Back Button */}
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({
                backgroundColor: '#666666',
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 12,
                opacity: pressed ? 0.8 : 1,
                marginTop: 20,
              })}
            >
              <Text className="text-white text-center font-bold text-lg">
                Back
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (mode === 'host') {
    return (
      <ScreenContainer className="p-6 bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 gap-6 justify-center items-center">
            {/* Header */}
            <View className="items-center gap-2">
              <Text className="text-2xl font-bold text-foreground">
                Host Game
              </Text>
              <Text className="text-sm text-muted text-center">
                Share this QR code with your opponent
              </Text>
            </View>

            {/* QR Code Display */}
            {qrCodeUrl ? (
              <View className="bg-surface rounded-lg p-6 border border-border w-full max-w-sm items-center">
                <View
                  style={{
                    width: 300,
                    height: 300,
                    backgroundColor: '#ffffff',
                    borderRadius: 8,
                    padding: 8,
                  }}
                >
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
              </View>
            ) : (
              <View className="bg-surface rounded-lg p-6 border border-border w-full max-w-sm items-center">
                <Text className="text-muted text-center">
                  Generating QR code...
                </Text>
              </View>
            )}

            {/* Connection Status */}
            <View className="bg-surface rounded-lg p-4 border border-border w-full max-w-sm">
              <Text className="text-sm text-muted text-center">
                {connectionStatus === 'waiting' && 'Waiting for opponent to scan and connect...'}
                {connectionStatus === 'connected' && '✓ Opponent connected! Starting game...'}
                {connectionStatus === 'failed' && '✗ Connection failed. Please try again.'}
              </Text>
            </View>

            {/* Back Button */}
            <Pressable
              onPress={() => setMode('select')}
              style={({ pressed }) => ({
                backgroundColor: '#666666',
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 12,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text className="text-white text-center font-bold text-lg">
                Back
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (mode === 'join') {
    return (
      <ScreenContainer className="p-6 bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 gap-6 justify-center items-center">
            {/* Header */}
            <View className="items-center gap-2">
              <Text className="text-2xl font-bold text-foreground">
                Join Game
              </Text>
              <Text className="text-sm text-muted text-center">
                Connected to opponent
              </Text>
            </View>

            {/* Connection Status */}
            <View className="bg-surface rounded-lg p-6 border border-border w-full max-w-sm items-center">
              <Text className="text-lg font-semibold text-success mb-2">
                ✓ Connected
              </Text>
              <Text className="text-xs text-muted text-center">
                Connection ID: {connectionId.substring(0, 12)}...
              </Text>
            </View>

            {/* Status Message */}
            <View className="bg-primary/10 rounded-lg p-4 border border-primary w-full max-w-sm">
              <Text className="text-sm text-foreground text-center font-medium">
                Initializing multiplayer game...
              </Text>
            </View>

            {/* Back Button */}
            <Pressable
              onPress={() => setMode('select')}
              style={({ pressed }) => ({
                backgroundColor: '#666666',
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 12,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text className="text-white text-center font-bold text-lg">
                Cancel
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return null;
}
