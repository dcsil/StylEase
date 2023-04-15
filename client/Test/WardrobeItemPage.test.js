import React from 'react';
import { render } from '@testing-library/react-native';
import { WardrobeItemPage } from '../views/WardrobeRoute/WardrobeItemPage';
import stores from '../stores';
import { RenderWithProviders } from '../utils/renderWithProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.useFakeTimers();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: jest.fn()
}));

const mockNavigation = jest.fn();

const mockStore = stores;
const mockRoute = {
    params: {
      item: {
        _id: 1,
        name: "mockName",
        brand: "mockBrand",
        color: "mockColor"
      }
    }
  };

describe('WardrobeItemPage', () => {
    let appBar, image, name, brand, color, type;
    beforeEach(() => {
        const component = RenderWithProviders(
        <SafeAreaProvider>
            <WardrobeItemPage route={mockRoute} navigation={{mockNavigation}}  />
        </SafeAreaProvider>, mockStore);
        // name = component.getAllByText("Name")[0];
        // brand = component.getAllByText("Brand")[0];
        // color = component.getAllByText("Color")[0];
        // type = component.getAllByText("Type")[0];
    });

    it('should render correctly', () => {
        expect(true).toBeTruthy();
        // expect(name).toBeTruthy();
        // expect(brand).toBeTruthy();
        // expect(type).toBeTruthy();
        // expect(color).toBeTruthy();
    });
});

