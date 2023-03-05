import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: "https://71ed77cdaeff44e7b814cd90fce00f97@o358880.ingest.sentry.io/4504487922565120",
});

export default function App() {
  return (
    <Sentry.ErrorBoundary showDialog>
      <View style={styles.container}>
        <Text>StylEase by No Brainer Team</Text>
        <StatusBar style="auto" />
      </View>
    </Sentry.ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
