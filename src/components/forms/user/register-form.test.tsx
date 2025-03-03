import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, NextRouter } from 'next/router';
import RegisterForm from './register-form';
import { useAuthStore } from 'src/store/auth-store';
import fetcher from 'src/utils/fetcher';

// Define types for mocks
interface AuthState {
  login: (user: { id: string; email: string }, token: string) => void;
}

interface FetcherResponse {
  data: { user: { id: string; email: string }; token: string } | null;
  error: string | null;
  status: number;
}

// Before your test, add a more flexible type
type AnyFunction = (...args: any[]) => any;

// Mock dependencies
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Update the mock for useAuthStore
jest.mock('src/store/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('src/utils/fetcher', () => ({
  __esModule: true,
  default: jest.fn() as jest.MockedFunction<typeof fetcher>,
}));

describe('RegisterForm Component', () => {
  const mockPush = jest.fn();
  const mockLogin = jest.fn();
  const mockResponse: FetcherResponse = {
    data: { user: { id: '123', email: 'test@example.com' }, token: 'test-token' },
    error: null,
    status: 200,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useRouter with all necessary properties
    // Mock useRouter with all necessary properties
(useRouter as jest.MockedFunction<typeof useRouter>).mockReturnValue({
  push: mockPush,
  query: {},
  pathname: '',
  asPath: '',
  route: '',
  basePath: '',
  isReady: true,
  isFallback: false,
  events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  replace: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  back: jest.fn(),
  beforePopState: jest.fn(),
  reload: jest.fn(),
  isLocaleDomain: false,
  // Add the missing properties
  forward: jest.fn(),
  isPreview: false
} as NextRouter);

// Use a type assertion to bypass TypeScript's strict checking
((useAuthStore as unknown) as jest.Mock<any>).mockImplementation(
  (selector: (state: AuthState) => any) => {
    return selector({ login: mockLogin });
  }
);
    // Mock fetcher
    (fetcher as jest.MockedFunction<typeof fetcher>).mockResolvedValue(mockResponse);
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
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });
    const form = screen.getByRole('button', { name: /register/i }).closest('form')!;
    fireEvent.submit(form);
    const errorMessage = await screen.findByText(/email is required/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
    expect(fetcher).not.toHaveBeenCalled();
  });

  test('shows error when password is empty', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });
    const form = screen.getByRole('button', { name: /register/i }).closest('form')!;
    fireEvent.submit(form);
    const errorMessage = await screen.findByText(/password is required/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });

  test('shows error when confirm password is empty', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });
    const form = screen.getByRole('button', { name: /register/i }).closest('form')!;
    fireEvent.submit(form);
    const errorMessage = await screen.findByText(/confirm password is required/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });

  test('shows error when passwords do not match', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'differentpassword' },
    });
    const form = screen.getByRole('button', { name: /register/i }).closest('form')!;
    fireEvent.submit(form);
    const errorMessage = await screen.findByText(/passwords you entered don'?t match/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });

  test('handles successful registration', async () => {
    (fetcher as jest.MockedFunction<typeof fetcher>).mockResolvedValue(mockResponse);
    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });
    const form = screen.getByRole('button', { name: /register/i }).closest('form')!;
    fireEvent.submit(form);
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
    (fetcher as jest.MockedFunction<typeof fetcher>).mockResolvedValue({
      data: null,
      error: 'Email already registered',
      status: 409,
    });
    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), {
      target: { value: 'existing@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });
    const form = screen.getByRole('button', { name: /register/i }).closest('form')!;
    fireEvent.submit(form);
    const errorMessage = await screen.findByText(/this email is already registered/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });

  test('handles bad request error', async () => {
    (fetcher as jest.MockedFunction<typeof fetcher>).mockResolvedValue({
      data: null,
      error: 'Invalid email format',
      status: 400,
    });
    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });
    const form = screen.getByRole('button', { name: /register/i }).closest('form')!;
    fireEvent.submit(form);
    const errorMessage = await screen.findByText(/invalid email format/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });

  test('handles server error', async () => {
    (fetcher as jest.MockedFunction<typeof fetcher>).mockResolvedValue({
      data: null,
      error: 'Internal server error',
      status: 500,
    });
    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });
    const form = screen.getByRole('button', { name: /register/i }).closest('form')!;
    fireEvent.submit(form);
    const errorMessage = await screen.findByText(/technical difficulties/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });

  test('handles unexpected error during API call', async () => {
    (fetcher as jest.MockedFunction<typeof fetcher>).mockRejectedValue(new Error('Network error'));
    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });
    const form = screen.getByRole('button', { name: /register/i }).closest('form')!;
    fireEvent.submit(form);
    const errorMessage = await screen.findByText(/network error/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });

  test('handles non-Error object thrown', async () => {
    (fetcher as jest.MockedFunction<typeof fetcher>).mockRejectedValue('Something went wrong');
    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText('username@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });
    const form = screen.getByRole('button', { name: /register/i }).closest('form')!;
    fireEvent.submit(form);
    const errorMessage = await screen.findByText(/unexpected error/i, {}, { timeout: 3000 });
    expect(errorMessage).toBeInTheDocument();
  });
});