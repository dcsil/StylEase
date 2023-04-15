import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { OutfitRoute } from '../views/OutfitRoute';
import { RenderWithProviders } from '../utils/renderWithProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationContext } from "@react-navigation/native"
import stores from '../stores';

jest.useFakeTimers();

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => jest.fn(),
    useSelector: jest.fn().mockReturnValue({ 
        userInfo: {
            data: {
                outfit_collections: []
            }
        }
    })
  }));
  const mockNavigation = jest.fn();
  
  const mockStore = stores

describe('OutfitRoute', () => {
    let appBar, result;
    beforeEach(() => {
    result = RenderWithProviders(
        <SafeAreaProvider>
            <NavigationContainer>
                <NavigationContext.Provider>
                    <OutfitRoute navigation={{ navigate: mockNavigation }} />
                </NavigationContext.Provider>
            </NavigationContainer>
        </SafeAreaProvider>
    , mockStore);
    });

    it('should render correctly', async () => {
        expect(true).toBeTruthy();
    });
});
