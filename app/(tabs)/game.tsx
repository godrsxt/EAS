import React, { useEffect, useRef } from 'react';
import { View, Dimensions } from 'react-native';
import { GameManager } from '../game/game-manager';

export default function GameScreen() {
  const gameManagerRef = useRef<GameManager | null>(null);
  const containerRef = useRef<View>(null);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const gameManager = new GameManager('game-canvas', 'single');
        await gameManager.initialize();
        gameManagerRef.current = gameManager;
      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    };

    initializeGame();

    return () => {
      gameManagerRef.current?.dispose();
    };
  }, []);

  return (
    <View
      ref={containerRef}
      style={{
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#000',
      }}
    >
      <canvas
        id="game-canvas"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </View>
  );
}
