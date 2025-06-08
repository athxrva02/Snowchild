import StreakGrid from '@/components/StreakGrid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const scheme = useColorScheme();

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
}

export default function HabitScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    const data = await AsyncStorage.getItem('habits');
    if (data) setHabits(JSON.parse(data));
  };

  const saveHabits = async (habits: Habit[]) => {
    await AsyncStorage.setItem('habits', JSON.stringify(habits));
  };

  const toggleHabit = async (habitId: string) => {
    const updated = habits.map(habit => {
      if (habit.id === habitId) {
        const updatedDates = habit.completedDates.includes(today)
          ? habit.completedDates.filter(date => date !== today)
          : [...habit.completedDates, today];
        return { ...habit, completedDates: updatedDates };
      }
      return habit;
    });
    setHabits(updated);
    saveHabits(updated);
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const updated = [
      ...habits,
      { id: uuidv4(), name: newHabit.trim(), completedDates: [] },
    ];
    setHabits(updated);
    saveHabits(updated);
    setNewHabit('');
  };

  const getStreak = (completedDates: string[]): number => {
    const sorted = [...completedDates].sort().reverse();
    let streak = 0;
    for (let i = 0; i < sorted.length; i++) {
      const date = new Date(sorted[i]);
      const compareDate = new Date();
      compareDate.setDate(compareDate.getDate() - i);
      if (date.toDateString() === compareDate.toDateString()) streak++;
      else break;
    }
    return streak;
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          value={newHabit}
          onChangeText={setNewHabit}
          placeholder="New habit"
          style={styles.input}
        />
        <Button title="Add" onPress={addHabit} />
      </View>
      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleHabit(item.id)} style={styles.habitRow}>
            <Text style={styles.habitName}>{item.name}</Text>
            <Text>{item.completedDates.includes(today) ? '✅' : '⬜️'}</Text>
            <StreakGrid completedDates={item.completedDates} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
    height: 40,
  },
  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    backgroundColor: scheme === 'dark' ? '#121212' : '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  habitName: { fontSize: 16 },
  streak: { fontSize: 14, color: 'orange' },
});
