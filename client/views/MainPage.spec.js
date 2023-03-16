import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MainPage } from './MainPage';

describe('MainPage', () => {
  it('renders all tabs', async () => {
    const { getByText } = render(<MainPage />);
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Wardrobe')).toBeTruthy();
    expect(getByText('Outfit')).toBeTruthy();
    expect(getByText('Calendar')).toBeTruthy();
    expect(getByText('Me')).toBeTruthy();
  });
});