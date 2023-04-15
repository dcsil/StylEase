import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { RenderWithProviders } from '../utils/renderWithProvider';
import stores from '../stores';
import { MainPage } from '../views/MainPage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

jest.useFakeTimers();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: jest.fn()
}));

const mockNavigation = jest.fn();

const mockStore = stores;

// jest.mock('react-native-paper', () => ({
//   ...jest.requireActual('react-native-paper'),
//   createBottomTabNavigator:
// }));

jest.mock('@react-navigation/bottom-tabs', () => ({
  ...jest.requireActual('@react-navigation/bottom-tabs'),
  
}));


describe('MainPage', () => {
  let homeTab, wardrobeTab, outfitTab, calendarTab, profileTab;

  beforeEach(() => {
    RenderWithProviders(
      <NavigationContainer>
        <MainPage navigation={{ navigate: mockNavigation }} />
      </NavigationContainer>,
      mockStore);
    homeTab = screen.getAllByTestId('Home')[0];
    wardrobeTab = screen.getAllByTestId('Wardrobe')[0];
    outfitTab = screen.getAllByTestId('Outfit')[0];
    calendarTab = screen.getAllByTestId('Calendar')[0];
    profileTab = screen.getAllByTestId('Profile')[0];
  });

  it('should render correctly', async () => {
    expect(homeTab).toBeTruthy();
    expect(wardrobeTab).toBeTruthy();
    expect(outfitTab).toBeTruthy();
    expect(calendarTab).toBeTruthy();
    expect(profileTab).toBeTruthy();
  });

  // it('should navigate to wardrobe page when wardrobe tab is pressed', async () => {
  //     fireEvent.press(wardrobeTab);
  //     await waitFor(() => expect(mockNavigation).toHaveBeenCalled());
  // });

  // it('should navigate to outfit page when outfit tab is pressed', async () => {
  //     fireEvent.press(outfitTab);
  //     await waitFor(() => expect(mockNavigation).toHaveBeenCalled());
  // });

  // it('should navigate to calendar page when calendar tab is pressed', async () => {
  //     fireEvent.press(calendarTab);
  //     await waitFor(() => expect(mockNavigation).toHaveBeenCalled());
  // });

  // it('should navigate to profile page when profile tab is pressed', async () => {
  //     fireEvent.press(profileTab);
  //     await waitFor(() => expect(mockNavigation).toHaveBeenCalled());
  // });

});
