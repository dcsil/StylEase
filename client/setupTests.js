import '@testing-library/jest-native/extend-expect';
jest.mock('expo-font');
jest.mock('expo-asset');

import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);