import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
const { LoginPage } = require('./LoginPage');

// Mock the getName function
jest.mock('../api/temp', () => ({
  getName: jest.fn(() => Promise.resolve('mocked content')),
}));

describe('LoginPage', () => {
  it('renders the login button', () => {
    const { getByText } = render(<LoginPage />);
    const loginButton = getByText('Login');
    expect(loginButton).toBeDefined();
  });

  it('displays the content from the server', async () => {
    const { findByText } = render(<LoginPage />);
    const content = await findByText('mocked content');
    expect(content).toBeDefined();
  });

  it('navigates to the main screen on login', () => {
    const navigateMock = jest.fn();
    const { getByText } = render(<LoginPage navigation={{ navigate: navigateMock }} />);
    const loginButton = getByText('Login');
    fireEvent.press(loginButton);
    expect(navigateMock).toHaveBeenCalledWith('Main');
  });
});
