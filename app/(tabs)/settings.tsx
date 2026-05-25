import { ScrollView, Text, View, TouchableOpacity, Switch, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function SettingsScreen() {
  const router = useRouter();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [graphicsQuality, setGraphicsQuality] = useState<'low' | 'medium' | 'high'>('high');
  const [sensitivity, setSensitivity] = useState(50);
  const [fov, setFOV] = useState(75);

  return (
    <ScreenContainer className="p-6 bg-background">
      <ScrollView>
        <View className="gap-6">
          {/* Header */}
          <View className="items-center gap-2 mb-4">
            <Text className="text-3xl font-bold text-foreground">Settings</Text>
          </View>

          {/* Audio Settings */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-foreground">Audio</Text>
              <Switch
                value={audioEnabled}
                onValueChange={setAudioEnabled}
                trackColor={{ false: '#767577', true: '#0a7ea4' }}
              />
            </View>
            <Text className="text-sm text-muted">
              {audioEnabled ? 'Sounds and music enabled' : 'Sounds and music disabled'}
            </Text>
          </View>

          {/* Graphics Quality */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Graphics Quality
            </Text>
            <View className="gap-2">
              {(['low', 'medium', 'high'] as const).map((quality) => (
                <TouchableOpacity
                  key={quality}
                  onPress={() => setGraphicsQuality(quality)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor:
                      graphicsQuality === quality ? '#0a7ea4' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <Text
                    style={{
                      color: graphicsQuality === quality ? '#ffffff' : '#9BA1A6',
                      textTransform: 'capitalize',
                      fontWeight: graphicsQuality === quality ? 'bold' : 'normal',
                    }}
                  >
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Camera Sensitivity */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Camera Sensitivity
            </Text>
            <View className="gap-2">
              <View
                style={{
                  height: 6,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${sensitivity}%`,
                    backgroundColor: '#0a7ea4',
                  }}
                />
              </View>
              <Text className="text-sm text-muted text-center">{sensitivity}%</Text>
            </View>
          </View>

          {/* Field of View */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Field of View
            </Text>
            <View className="gap-2">
              <View
                style={{
                  height: 6,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${(fov / 120) * 100}%`,
                    backgroundColor: '#0a7ea4',
                  }}
                />
              </View>
              <Text className="text-sm text-muted text-center">{fov}°</Text>
            </View>
          </View>

          {/* Game Info */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-2">
              About
            </Text>
            <Text className="text-sm text-muted mb-2">
              Survival Shooter 3D v1.0.0
            </Text>
            <Text className="text-xs text-muted">
              A 3D offline/local-multiplayer survival shooter game built with Babylon.js and WebGPU.
            </Text>
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
              marginBottom: 20,
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
