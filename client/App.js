import React from 'react';
import * as Sentry from 'sentry-expo';
import { Navigation } from './Navigation';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
import stores from './stores';

Sentry.init({
  dsn: "https://71ed77cdaeff44e7b814cd90fce00f97@o358880.ingest.sentry.io/4504487922565120",
});

export default function App() {
  return (
    <Sentry.Native.ErrorBoundary showDialog>
      <StoreProvider store={stores}>
        <PaperProvider>
          {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
            <Navigation />
          {/* </GestureHandlerRootView> */}
        </PaperProvider>
      </StoreProvider>
    </Sentry.Native.ErrorBoundary>
  );
}
