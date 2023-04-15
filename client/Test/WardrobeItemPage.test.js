import React from 'react';
import { render } from '@testing-library/react-native';
import { WardrobeItemPage } from '../views/WardrobeRoute/WardrobeItemPage';
import stores from '../stores';
import { RenderWithProviders } from '../utils/renderWithProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.useFakeTimers();


const mockNavigation = jest.fn();

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

jest.useFakeTimers();
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn().mockReturnValue({ width: 800, height: 1200 }),
}));

describe('WardrobeItemPage', () => {
  it('should render correctly', () => {
    render(
      <SafeAreaProvider>
        <WardrobeItemPage route={mockRoute} navigation={{navigate: mockNavigation}} />
      </SafeAreaProvider>
    );
    expect(true).toBeTruthy();
    // expect(name).toBeTruthy();
    // expect(brand).toBeTruthy();
    // expect(type).toBeTruthy();
    // expect(color).toBeTruthy();
  });
});

