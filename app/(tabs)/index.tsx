import { ScrollView, Text, View, Image, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-8 justify-center items-center">
          {/* Game Logo */}
          <View className="items-center gap-4">
            <Image
              source={require('@/assets/images/icon.png')}
              style={{ width: 120, height: 120 }}
            />
            <Text className="text-4xl font-bold text-foreground text-center">
              Survival Shooter 3D
            </Text>
            <Text className="text-base text-muted text-center">
              Battle AI enemies or challenge a friend in local multiplayer
            </Text>
          </View>

          {/* Game Mode Buttons */}
          <View className="w-full max-w-sm gap-4">
            {/* Single Player Button */}
            <Pressable
              onPress={() => router.push('/game')}
              style={({ pressed }) => ({
                backgroundColor: '#0a7ea4',
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 12,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text className="text-white text-center font-bold text-lg">
                Single Player
              </Text>
              <Text className="text-white text-center text-xs opacity-80 mt-1">
                Survive against 3 AI bots
              </Text>
            </Pressable>

            {/* Multiplayer Button */}
            <Pressable
              onPress={() => router.push('/multiplayer')}
              style={({ pressed }) => ({
                backgroundColor: '#ff6b35',
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 12,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text className="text-white text-center font-bold text-lg">
                Local Multiplayer
              </Text>
              <Text className="text-white text-center text-xs opacity-80 mt-1">
                1v1 over Wi-Fi with QR code handshake
              </Text>
            </Pressable>

            {/* Settings Button */}
            <Pressable
              onPress={() => router.push('/settings')}
              style={({ pressed }) => ({
                backgroundColor: '#666666',
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 12,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text className="text-white text-center font-bold text-lg">
                Settings
              </Text>
            </Pressable>
          </View>

          {/* Game Info */}
          <View className="w-full max-w-sm bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Game Features
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              • 3D WebGPU graphics engine{'\n'}
              • AI-powered enemy bots{'\n'}
              • Local Wi-Fi multiplayer{'\n'}
              • Offline gameplay support{'\n'}
              • Touch and keyboard controls
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
