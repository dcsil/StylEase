import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { WardrobeRoute } from '../views/WardrobeRoute';
import UserReducer from "../stores/UserStore";
import { SafeAreaView, ScrollView } from 'react-native';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
// import { NavigationContext } from '@react-navigation/native';



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
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn().mockReturnValue({ cancelled: false, assets:[{base64: ''}] }),
  requestMediaLibraryPermissionsAsync: jest.fn().mockReturnValue({ status: 'granted' }),
}));

const mockNavigation = jest.fn();
const mockNavigationFocused = jest.fn().mockReturnValue(true);
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

describe('WardrobeRoute', () => {

  it('should render correctly', async () => {
    render(
      <SafeAreaProvider>
        <NavigationContainer>
          <Provider store={mockStore}>
            <WardrobeRoute navigation={navContext} />
          </Provider>
        </NavigationContainer>
      </SafeAreaProvider>
    );
    fab = screen.getByTestId("wardrobe-route-add-item");
    fireEvent.press(fab);
    // console.log(searchBar);
    // expect(searchBar).toBeTruthy();
  });

});
