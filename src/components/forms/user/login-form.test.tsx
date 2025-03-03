import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './login-form';
import { useAuthStore } from 'src/store/auth-store';
import { useRouter } from 'next/router';
import fetcher from 'src/utils/fetcher';

// Add proper type for fetcher response
declare module 'src/utils/fetcher' {
  interface FetcherResponse<T> {
    status: number;
    data: T | null;
    error: string | null;
  }
}

jest.mock('src/store/auth-store');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('src/utils/fetcher');

const mockLogin = jest.fn();
const mockPush = jest.fn();
const mockFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

beforeEach(() => {
  (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
    return selector({ login: mockLogin });
  });
  
  (useRouter as jest.Mock).mockImplementation(() => ({
    push: mockPush,
  }));
  
  mockFetcher.mockReset();
  mockLogin.mockReset();
  mockPush.mockReset();
});

describe('LoginForm', () => {
  it('submits valid form and redirects on success', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockToken = 'fake-token';
    
    mockFetcher.mockResolvedValueOnce({
      status: 200,
      data: { user: mockUser, token: mockToken },
      error: null,
    });

    render(<LoginForm />);
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockFetcher).toHaveBeenCalledWith(
        { email: 'test@example.com', password: 'password123' },
        '/api/auth/login'
      );
    });

    expect(mockLogin).toHaveBeenCalledWith(mockUser, mockToken);
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('displays error message on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    mockFetcher.mockResolvedValueOnce({
      status: 401,
      data: null,
      error: errorMessage,
    });

    render(<LoginForm />);
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'wrongpass');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('handles loading state during submission', async () => {
    mockFetcher.mockImplementationOnce(
      () => new Promise((resolve) => 
        setTimeout(() => resolve({
          status: 200,
          data: null,
          error: null
        }), 100)
      )
    );

    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Logging in...');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});