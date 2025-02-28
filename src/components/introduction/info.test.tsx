
import React from 'react';
import { render } from '@testing-library/react';
import Info from './info'; // Adjust the import path if necessary

describe('Info Component', () => {
  it('renders the correct information text', () => {
    const { getByText } = render(<Info />);
    expect(getByText('We provide you Storage space for all questions')).toBeInTheDocument();
    expect(getByText('And auto generate session for test')).toBeInTheDocument();
  });

  it('has the correct classes applied', () => {
    const { container } = render(<Info />);
    expect(container.firstChild).toHaveClass('text-xl p-2');
  });
});