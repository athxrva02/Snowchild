// File: app/components/StreakGrid.tsx
import { daysForSheet } from '@/utils/utils';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
  completedDates: string[];
}

const getDateKey = (date: Date) => date.toISOString().split('T')[0];

const getColor = (streakCount: number): string => {
  if (streakCount >= 5) return '#006400';  // deep green
  if (streakCount >= 3) return '#228B22';  // forest green
  if (streakCount >= 1) return '#32CD32';  // lime green
  return '#ccc';                           // gray
};

const generateLastNDays = (days: number): Date[] => {
  const result = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    result.push(date);
  }
  return result;
};

const StreakGrid: React.FC<Props> = ({ completedDates }) => {
  const completedSet = new Set(completedDates);
  const days = generateLastNDays(daysForSheet); // 3x7 grid

  return (
    <View style={styles.grid}>
      {days.map((date, index) => {
        const key = getDateKey(date);
        const isCompleted = completedSet.has(key);

        // check consecutive streak from this day backwards
        let streak = 0;
        for (let offset = 0; offset < 7; offset++) {
          const checkDate = new Date(date);
          checkDate.setDate(date.getDate() - offset);
          const checkKey = getDateKey(checkDate);
          if (completedSet.has(checkKey)) streak++;
          else break;
        }

        return (
          <TouchableOpacity
            key={key + index}
            style={[styles.square, { backgroundColor: getColor(isCompleted ? streak : 0) }]}
            onPress={() => alert(`${key} - ${isCompleted ? `✅ streak: ${streak}` : '❌ missed'}`)}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 120,
    marginTop: 8,
    marginBottom: 12,
  },
  square: {
    width: 12,
    height: 12,
    borderRadius: 4,
    margin: 2,
  },
});

export default StreakGrid;