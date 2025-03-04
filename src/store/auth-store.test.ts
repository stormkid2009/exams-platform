import { useAuthStore } from './auth-store';

describe('useAuthStore', () => {
  // Before each test, clear localStorage and reset the store's state
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  });

  it('should have an initial state with no user, token, and not authenticated', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should update state correctly when login is called', () => {
    const user = { id: '1', email: 'test@example.com' };
    const token = 'sample-token';
    // Invoke the login action
    useAuthStore.getState().login(user, token);
    
    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should reset state correctly when logout is called', () => {
    const user = { id: '1', email: 'test@example.com' };
    const token = 'sample-token';
    // First log in
    useAuthStore.getState().login(user, token);
    // Then log out
    useAuthStore.getState().logout();
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

