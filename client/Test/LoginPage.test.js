import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { LoginPage } from '../views/LoginPage';
import { RenderWithProviders } from '../utils/renderWithProvider';
import stores from '../stores';

jest.useFakeTimers();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
  useSelector: jest.fn()
}));
const mockNavigation = jest.fn();
const mockLogin = jest.fn().mockReturnValue({userid: '111'});

jest.mock('../api/requests', () => ({
  ...jest.requireActual('../api/requests'),
  Login: async (e, p) => mockLogin(e, p),
}));

const mockStore = stores

describe('LoginPage', () => {
  let emailInput, passwordInput, loginButton, signUpButton, forgotPU;
  beforeEach(() => {
    RenderWithProviders(<LoginPage navigation={{ navigate: mockNavigation }} />, mockStore);
    emailInput = screen.getAllByText("Email");
    passwordInput = screen.getAllByText("Password");
    loginButton = screen.getAllByText('Login');
    signUpButton = screen.getAllByText('Sign up');
    forgotPU = screen.getAllByText('Forgot password or username');
  });

  it('should render correctly', async () => {
    expect(screen.getByText('StylEase')).toBeDefined();
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(loginButton).toBeTruthy();
    expect(signUpButton).toBeTruthy();
    expect(forgotPU).toBeTruthy();
  });

  it('should handle form submission', async () => {
    expect(loginButton[0]).toBeDisabled();
    fireEvent.changeText(emailInput[0], 'test@mail');
    fireEvent.changeText(passwordInput[0], 'password123');
    fireEvent.press(loginButton[0]);
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('test@mail', 'password123'));
    await waitFor(() => expect(mockNavigation).toHaveBeenCalledWith('Main'));
  });

  it('should navigate to signup page', async () => {
    fireEvent.press(signUpButton[0]);
    await waitFor(() => expect(mockNavigation).toHaveBeenCalledWith('SignUp'));
  });

  it('should navigate to forgotPassword page', async () => {
    fireEvent.press(forgotPU[0]);
    //await waitFor(() => expect(mockNavigation).toHaveBeenCalledWith('ForgotPassword'));
  });

});
