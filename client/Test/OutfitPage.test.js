import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { OutfitRoute } from '../views/OutfitRoute';
import { RenderWithProviders } from '../utils/renderWithProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationContext } from "@react-navigation/native"
import UserReducer from "../stores/UserStore";
import { configureStore } from '@reduxjs/toolkit';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';

jest.useFakeTimers();
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn().mockReturnValue({ width: 800, height: 1200 }),
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => jest.fn(),
  // useFocusEffect: () => jest.fn(),
}));

const mockStore = configureStore({
  reducer: {
    user: UserReducer,
  },
  preloadedState: {
    user: {
      loading: false,
      userInfo: {
        _id: '123',
        data: {
          wardrobe: {
            items: [
              { _id: '1', name: 'test', type: 'top', color: 'red', image: 'test' },
              { _id: '2', name: 'test', type: 'top', color: 'red', image: 'test' },
            ]
          },
          outfits_collections: [
            { _id: '1', name: 'test', items: ['1', '2'] },
            { _id: '2', name: 'test', items: ['1', '2'] },
          ]
        }
      }
    }
  }
});


const mockNavigation = jest.fn();

const navContext = {
  isFocused: () => true,
  // addListener returns an unscubscribe function.
  navigate: mockNavigation,
  addListener: jest.fn(() => jest.fn())
}

const renderComp = (
  <SafeAreaProvider>
    <PaperProvider>
      <NavigationContainer>
        <StoreProvider store={mockStore}>
          <OutfitRoute navigation={navContext} />
        </StoreProvider>
      </NavigationContainer>
    </PaperProvider>
  </SafeAreaProvider>
)

describe('OutfitRoute', () => {

  it('should render correctly', async () => {
    render(
      renderComp
    );
    expect(screen.getByTestId('outfit-route-add-button')).toBeTruthy();
  });

  it('press option1', async () => {
    render(
      renderComp
    );
    fireEvent.press(screen.getByTestId('outfit-route-add-button'));
    fireEvent.press(screen.getByTestId('open1'));
  });

  it('press option2', async () => {
    render(
      renderComp
    );
    fireEvent.press(screen.getByTestId('outfit-route-add-button'));
    fireEvent.press(screen.getByTestId('open2'));
  });
});
