// File: app/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const scheme = useColorScheme();

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        initialRouteName="habit"
        screenOptions={{
          headerStyle: {
            backgroundColor: scheme === 'dark' ? '#000' : '#fff',
          },
          headerTintColor: scheme === 'dark' ? '#fff' : '#000',
          tabBarStyle: {
            backgroundColor: scheme === 'dark' ? '#000' : '#fff',
          },
          tabBarActiveTintColor: scheme === 'dark' ? '#fff' : '#000',
        }}
      >
        <Tabs.Screen
          name="habit"
          options={{
            title: 'Habits',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="checkmark-done" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="pomodoro"
          options={{
            title: 'Pomodoro',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="timer" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: 'Journal',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
