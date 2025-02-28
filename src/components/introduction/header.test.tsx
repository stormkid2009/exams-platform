
import React from 'react';
import { render } from '@testing-library/react';
import Header from './header'; // Adjust the import path if necessary

describe('Header Component', () => {
  it('renders the header with the correct title', () => {
    const { getByText } = render(<Header />);
    expect(getByText('Welcome to Your Questions Storage')).toBeInTheDocument();
  });

  it('has the correct classes applied', () => {
    const { container } = render(<Header />);
    expect(container.firstChild).toHaveClass('font-mono text-2xl p-2');
  });
});