import { NavigationContext } from "@react-navigation/native"
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { CalendarRoute } from '../views/CalendarRoute';
import { RenderWithProviders } from '../utils/renderWithProvider';
import UserReducer from "../stores/UserStore";
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { configureStore } from "@reduxjs/toolkit";
import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { OutfitRoute } from "../views/OutfitRoute";
import { act } from "react-test-renderer";

jest.useFakeTimers();

const mockNavigation = jest.fn();

const navContext = {
  isFocused: () => true,
  // addListener returns an unscubscribe function.
  navigate: mockNavigation,
  addListener: jest.fn(() => jest.fn())
}

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
          }
        }
      }
    }
  }
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => jest.fn(),
  // useFocusEffect: () => jest.fn(),
}));

jest.mock('../api/requests.js', () => ({
  getAllDays: jest.fn(() => Promise.resolve({ days: [] } )),
  getOutfit: jest.fn(() => Promise.resolve({
    data: {
      outfit: {
        items: [
          { _id: '1', name: 'test', type: 'top', color: 'red', image: 'test' },
        ]
      }
    }
  })),
  getPlan: jest.fn(() => Promise.resolve({
    plan: {
      dayId: ''
    }
  })),
}));

const renderComp = (
  <SafeAreaProvider>
    <PaperProvider>
      <NavigationContainer>
        <StoreProvider store={mockStore}>
          <CalendarRoute navigation={navContext} />
        </StoreProvider>
      </NavigationContainer>
    </PaperProvider>
  </SafeAreaProvider>
)

describe('Clender Route', () => {
  // let header, searchBar, icon;

  it('should render correctly', async () => {
    render(renderComp);
    expect(screen.getByTestId('calender-add-item')).toBeTruthy();
  });

});
