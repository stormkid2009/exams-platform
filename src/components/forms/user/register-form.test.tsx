import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import RegisterForm from './register-form';
import { useAuthStore } from 'src/store/auth-store';
import fetcher from 'src/utils/fetcher';

// Mock dependencies
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('src/store/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('src/utils/fetcher', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock Next/Link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('RegisterForm Component', () => {
  // Setup common mocks
  const mockPush = jest.fn();
  const mockLogin = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock router
    (useRouter).mockReturnValue({
      push: mockPush,
    });
    
    // Mock auth store
    (useAuthStore).mockImplementation((selector) => {
      return selector({ login: mockLogin });
    });
  });

  test('renders register form with all fields', () => {
    render(<RegisterForm />);
    
    expect(screen.getByPlaceholderText('username@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('shows error when email is empty', async () => {
    render(<RegisterForm />);
    
    // Fill password fields but leave email empty
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { 
      target: { value: 'password123' } 
    });
    
    // Get the form and submit directly
    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    fireEvent.submit(form);
    
    // Use case-insensitive regex for error message
    const errorMessage = await screen.findByText(/email is required/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
    
    // Verify the API wasn't called
    expect(fetcher).not.toHaveBeenCalled();
  });

  test('shows error when password is empty', async () => {
    render(<RegisterForm />);
    
    // Fill email and confirm password fields but leave password empty
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { 
      target: { value: 'password123' } 
    });
    
    // Get the form and submit directly
    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    fireEvent.submit(form);
    
    // Use case-insensitive regex for error message
    const errorMessage = await screen.findByText(/password is required/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });

  test('shows error when confirm password is empty', async () => {
    render(<RegisterForm />);
    
    // Fill email and password fields but leave confirm password empty
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { 
      target: { value: 'password123' } 
    });
    
    // Get the form and submit directly
    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    fireEvent.submit(form);
    
    // Use case-insensitive regex for error message
    const errorMessage = await screen.findByText(/confirm password is required/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });

  test('shows error when passwords do not match', async () => {
    render(<RegisterForm />);
    
    // Fill all fields with non-matching passwords
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { 
      target: { value: 'differentpassword' } 
    });
    
    // Get the form and submit directly
    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    fireEvent.submit(form);
    
    // Use case-insensitive regex for error message
    const errorMessage = await screen.findByText(/passwords you entered don'?t match/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });

  test('handles successful registration', async () => {
    // Mock successful response
    const mockResponse = {
      data: {
        user: { id: '123', email: 'test@example.com' },
        token: 'test-token'
      },
      error: null,
      status: 200
    };
    
    (fetcher).mockResolvedValue(mockResponse);
    
    render(<RegisterForm />);
    
    // Fill all fields correctly
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { 
      target: { value: 'password123' } 
    });
    
    // Get the form and submit directly
    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    fireEvent.submit(form);
    
    // Use a single waitFor for all assertions since they’re related to the same async operation
    await waitFor(() => {
      expect(fetcher).toHaveBeenCalledWith(
        { email: 'test@example.com', password: 'password123' },
        '/api/auth/register'
      );
      expect(mockLogin).toHaveBeenCalledWith(
        { id: '123', email: 'test@example.com' },
        'test-token'
      );
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    }, { timeout: 3000 });
  });

  test('handles email already registered error', async () => {
    // Mock error response for existing email
    (fetcher).mockResolvedValue({
      data: null,
      error: 'Email already registered',
      status: 409
    });
    
    render(<RegisterForm />);
    
    // Fill all fields correctly
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), { 
      target: { value: 'existing@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { 
      target: { value: 'password123' } 
    });
    
    // Get the form and submit directly
    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    fireEvent.submit(form);
    
    // Use case-insensitive regex for error message
    const errorMessage = await screen.findByText(/this email is already registered/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });

  test('handles bad request error', async () => {
    // Mock error response for bad request
    (fetcher).mockResolvedValue({
      data: null,
      error: 'Invalid email format',
      status: 400
    });
    
    render(<RegisterForm />);
    
    // Fill all fields
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), { 
      target: { value: 'invalid-email' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { 
      target: { value: 'password123' } 
    });
    
    // Get the form and submit directly
    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    fireEvent.submit(form);
    
    // Use case-insensitive regex for error message
    const errorMessage = await screen.findByText(/invalid email format/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });

  test('handles server error', async () => {
    // Mock error response for server error
    (fetcher).mockResolvedValue({
      data: null,
      error: 'Internal server error',
      status: 500
    });
    
    render(<RegisterForm />);
    
    // Fill all fields
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { 
      target: { value: 'password123' } 
    });
    
    // Get the form and submit directly
    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    fireEvent.submit(form);
    
    // Use case-insensitive regex for error message
    const errorMessage = await screen.findByText(/technical difficulties/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });

  test('handles unexpected error during API call', async () => {
    // Mock fetch to throw an error
    (fetcher).mockRejectedValue(new Error('Network error'));
    
    render(<RegisterForm />);
    
    // Fill all fields
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { 
      target: { value: 'password123' } 
    });
    
    // Get the form and submit directly
    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    fireEvent.submit(form);
    
    // Use case-insensitive regex for error message
    const errorMessage = await screen.findByText(/network error/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });

  test('handles non-Error object thrown', async () => {
    // Mock fetch to throw a non-Error object
    (fetcher).mockRejectedValue('Something went wrong');
    
    render(<RegisterForm />);
    
    // Fill all fields
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { 
      target: { value: 'password123' } 
    });
    
    // Get the form and submit directly
    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    fireEvent.submit(form);
    
    // Use case-insensitive regex for error message
    const errorMessage = await screen.findByText(/unexpected error/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });
});
