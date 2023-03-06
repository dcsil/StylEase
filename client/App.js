import React from 'react';
import * as Sentry from '@sentry/react-native';
import { Navigation } from './Navigation';
import { Provider as PaperProvider } from 'react-native-paper';

Sentry.init({
  dsn: "https://71ed77cdaeff44e7b814cd90fce00f97@o358880.ingest.sentry.io/4504487922565120",
});

export default function App() {
  return (
    <Sentry.ErrorBoundary showDialog>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </Sentry.ErrorBoundary>
  );
}
