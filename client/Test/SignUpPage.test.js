import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { RenderWithProviders } from '../utils/renderWithProvider';
import stores from '../stores';
import { SignupPage } from '../views/SignUpPage';


jest.useFakeTimers();

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => jest.fn(),
    useSelector: jest.fn()
  }));

const mockNavigation = jest.fn();
const mockIsValidInfo = jest.fn();
const mockSignUp = jest.fn();

jest.mock('../api/requests', () => ({
    ...jest.requireActual('../api/requests'),
    SignUp: async (n, e, p) => mockSignUp(n, e, p),
  }));

describe('SignupPage', () => {
    let nameInput, emailInput, passwordInput, confirmPasswordInput, signupButton, loginButton;
    beforeEach(() => {
        RenderWithProviders(<SignupPage navigation={{ navigate: mockNavigation}} />, stores);
        nameInput = screen.getAllByText("Name")[0];
        emailInput = screen.getAllByText("Email")[0];
        passwordInput = screen.getAllByText("Password")[0];
        confirmPasswordInput = screen.getAllByText("Confirm Password")[0];
        signupButton = screen.getAllByText('Sign up')[0];
        loginButton = screen.getAllByText('Login')[0];
    });
    it('displays all input fields and buttons', () => {
        expect(nameInput).toBeTruthy();
        expect(emailInput).toBeTruthy();
        expect(passwordInput).toBeTruthy();
        expect(confirmPasswordInput).toBeTruthy();
        expect(signupButton).toBeTruthy();
        expect(loginButton).toBeTruthy();
    });
    it('should handle form submission', async () => {
        fireEvent.changeText(nameInput, 'Test User');
        fireEvent.changeText(emailInput, 'testuser@test.com');
        fireEvent.changeText(passwordInput, 'testpassword');
        fireEvent.changeText(confirmPasswordInput, '123');
        fireEvent.changeText(confirmPasswordInput, 'testpassword');
        fireEvent.press(signupButton);
        await waitFor(() => expect(mockSignUp).toHaveBeenCalledWith('Test User', 'testuser@test.com', 'testpassword'));
        await waitFor(() => expect(mockNavigation).toHaveBeenCalledWith('Login'));
    });
    it('should navigate to login page', async () => {
        fireEvent.press(loginButton);
        await waitFor(() => expect(mockNavigation).toHaveBeenCalledWith('Login'));
    });
    it('validates input fields correctly', async () => {
        // empty inputs should be invalid
        expect(signupButton).toBeDisabled();

        // inputs with only name and email should be invalid
        fireEvent.changeText(nameInput, 'Test User');
        fireEvent.changeText(emailInput, 'testuser@test.com');
        expect(signupButton).toBeDisabled();

      
        // inputs with password mismatch should be invalid
        fireEvent.changeText(passwordInput, 'testpassword');
        fireEvent.changeText(confirmPasswordInput, '123');
        expect(signupButton).toBeDisabled();
      
        // valid inputs should be valid
        fireEvent.changeText(confirmPasswordInput, 'testpassword');
        expect(signupButton).not.toBeDisabled();
      });

});
