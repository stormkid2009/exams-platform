
import React from 'react';
import { render } from '@testing-library/react';
import Intro from './index'; // Adjust the import path if necessary

describe('Intro Component', () => {
  it('renders the Header and Info components', () => {
    const { getByText } = render(<Intro />);
    expect(getByText('Welcome to Your Questions Storage')).toBeInTheDocument();
    expect(getByText('We provide you Storage space for all questions')).toBeInTheDocument();
    expect(getByText('And auto generate session for test')).toBeInTheDocument();
  });

  it('has the correct outer class applied', () => {
    const { container } = render(<Intro />);
    expect(container.firstChild).toHaveClass('text-center');
  });
});