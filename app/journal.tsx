import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, useColorScheme, View } from 'react-native';

const scheme = useColorScheme();

export default function JournalScreen() {
  const [text, setText] = useState('');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('journal');
      if (saved) setText(saved);
    })();
  }, []);

  const handleChange = async (value: string) => {
    setText(value);
    await AsyncStorage.setItem('journal', value);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={handleChange}
        placeholder="Write your thoughts..."
        multiline
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: scheme === 'dark' ? '#121212' : '#fff' },
  input: { flex: 1, textAlignVertical: 'top', fontSize: 16, color: scheme === 'dark' ? '#fff' : '#000' },
});