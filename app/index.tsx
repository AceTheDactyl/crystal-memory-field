import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MemoryFieldProvider } from '@/providers/MemoryFieldProvider';
import { SolfeggioProvider } from '@/providers/SolfeggioProvider';
import CosmicMemoryField from '@/components/CosmicMemoryField';

export default function App() {
  return (
    <View style={styles.container}>
      <MemoryFieldProvider>
        <SolfeggioProvider>
          <CosmicMemoryField />
        </SolfeggioProvider>
      </MemoryFieldProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});