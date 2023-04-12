import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import { LoginPage} from '../views/LoginPage';
import thunk from 'redux-thunk';
import { RenderWithProviders } from '../utils/renderWithProvider';

const mockStore = configureMockStore([thunk]);

describe('LoginPage', () => {

  const initialState = {
    user: {
      userInfo: {
        _id: 'mockUserId'
      }
    }
  };

  const store = mockStore(initialState);

  it('should render correctly', () => {
    RenderWithProviders(<LoginPage />, { store: store });
    expect(screen.getByText('StylEase')).toBeDefined();
    const emailInput = screen.getByRole('textbox', { name: "Email" });
    expect(emailInput).toBeTruthy();

    const passwordInput = screen.getByRole('textbox', { name: "Password" });
    expect(passwordInput).toBeTruthy();

    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeTruthy();
    const signUpButton = screen.getByText('Sign up');
    expect(signUpButton).toBeTruthy();
    const forgotPU = screen.getByText('Forgot password or username');
    expect(forgotPU).toBeTruthy();
  });

  it('should handle form submission', async () => {
    const mockNavigate = jest.fn();
    const { getByText, getByLabelText } = RenderWithProviders(<LoginPage />, { store: store });
    fireEvent.changeText(getByLabelText('Email'), 'test@example.com');
    fireEvent.changeText(getByLabelText('Password'), 'password123');
    fireEvent.press(getByText('Login'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('Main'));
  });

  it('should navigate to signup page', () => {
    const mockNavigate = jest.fn();
    const { getByText, getByLabelText } = RenderWithProviders(<LoginPage />, { store: store });
    fireEvent.press(getByText('Sign up'));
    expect(mockNavigate).toHaveBeenCalledWith('SignUp');
  });

});
