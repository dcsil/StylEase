import { NavigationContext } from "@react-navigation/native"
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { WardrobeRoute } from '../views/WardrobeRoute';
import { RenderWithProviders } from '../utils/renderWithProvider';
import stores from '../stores';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import  { Input } from "./Input";



jest.useFakeTimers();

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => jest.fn(),
}));

const mockNavigation = jest.fn();

const mockStore = stores;

describe('WardrobeRoute', () => {
    let header, searchBar, icon;

    beforeEach(() => {
        RenderWithProviders(
            <SafeAreaProvider>
                <NavigationContainer>
                    <NavigationContext.Provider>
                        <WardrobeRoute navigation={{ navigate: mockNavigation }} />
                    </NavigationContext.Provider>
                </NavigationContainer>
            </SafeAreaProvider>
        , mockStore);
        //searchBar = screen.getByTestId("searchBar");
    });

    it('should render correctly', async () => {
        expect(true).toBeTruthy();
    });

});
