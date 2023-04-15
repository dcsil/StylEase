import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { RenderWithProviders } from '../utils/renderWithProvider';
import stores from '../stores';
import { MainPage } from '../views/MainPage';
import {NavigationContainer} from '@react-navigation/native';
import { BottomNavigation } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

jest.useFakeTimers();

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => jest.fn(),
    useSelector: jest.fn()
  }));


const Tab = createBottomTabNavigator();

const mockNavigation = jest.fn();

const mockStore = stores

// jest.mock('react-native-paper', () => ({
//     ...jest.requireActual('react-native-paper'),
//     BottomNavigation: {
//       Bar: jest.fn().mockImplementation(
//         ({
//           navigationState,
//           onTabPress,
//           renderIcon,
//           getLabelText,
//           ...rest
//         }) => (
//           <BottomNavigation
//             navigationState={navigationState}
//             onIndexChange={onTabPress}
//             renderIcon={({ route, focused, color }) =>
//               renderIcon({ route, focused, color })
//             }
//             renderLabel={({ route, focused, color }) => (
//               <Text style={{ color: focused ? 'blue' : 'black' }}>
//                 {getLabelText({ route })}
//               </Text>
//             )}
//             {...rest}
//           />
//         )
//       )
//     }
//   }));
  

describe('MainPage', () => {
    let homeTab, wardrobeTab, outfitTab, calendarTab, profileTab;

    beforeEach(() => {
        RenderWithProviders(
        <NavigationContainer>
            <MainPage navigation={{ navigate: mockNavigation }} />
        </NavigationContainer>, 
        mockStore);
        homeTab = screen.getAllByText('Home')[0];
        wardrobeTab = screen.getAllByText('Wardrobe')[0];
        outfitTab = screen.getAllByText('Outfit')[0];
        calendarTab = screen.getAllByText('Calendar')[0];
        profileTab = screen.getAllByText('Profile')[0];
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
