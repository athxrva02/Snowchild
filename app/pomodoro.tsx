import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, useColorScheme, View } from 'react-native';

const scheme = useColorScheme();

export default function PomodoroScreen() {
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Pomodoro finished! 🎉',
          body: 'Take a break or start a new session.',
        },
        trigger: null,
      });
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const startTimer = () => setIsRunning(true);
  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(25 * 60);
  };

  const formatTime = (secs: number) => `${Math.floor(secs / 60)}:${('0' + (secs % 60)).slice(-2)}`;

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>
      <Button title={isRunning ? 'Running...' : 'Start'} onPress={startTimer} disabled={isRunning} />
      <Button title="Reset" onPress={resetTimer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: scheme === 'dark' ? '#121212' : '#fff' },
  timer: { fontSize: 48, marginBottom: 20, color: scheme === 'dark' ? '#fff' : '#000' },
});
