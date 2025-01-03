// baseInput.test.tsx

import React, { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm, UseFormRegister } from 'react-hook-form';
import BaseInput, { BaseInputProps } from 'src/components/inputs/baseInput'; // Adjust the import path as necessary

interface MockFormProps {
  children: ReactNode; // Use ReactNode for better type safety
}

const MockForm: React.FC<MockFormProps> = ({ children }) => {
  const { register } = useForm();
  return <form>{React.cloneElement(children as React.ReactElement<BaseInputProps>, { register })}</form>;
};

describe('BaseInput Component', () => {
  test('renders text input with label', () => {
    render(
      <MockForm>
        <BaseInput name="testInput" label="Test Input" />
      </MockForm>
    );

    expect(screen.getByLabelText(/Test Input/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('renders textarea with label', () => {
    render(
      <MockForm>
        <BaseInput name="testTextarea" label="Test Textarea" type="textarea" />
      </MockForm>
    );

    expect(screen.getByLabelText(/Test Textarea/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('renders select input with options', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ];

    render(
      <MockForm>
        <BaseInput name="testSelect" label="Test Select" type="select" options={options} />
      </MockForm>
    );

    expect(screen.getByLabelText(/Test Select/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('displays error message when provided', () => {
    render(
      <MockForm>
        <BaseInput name="testInputWithError" label="Test Input With Error" errorMessage="This field is required." />
      </MockForm>
    );

    expect(screen.getByText(/This field is required./i)).toBeInTheDocument();
  });

  test('calls onChange handler when value changes', () => {
    const handleChange = jest.fn();
    render(
      <MockForm>
        <BaseInput name="testInput" label="Test Input" onChange={handleChange} />
      </MockForm>
    );

    const input = screen.getByLabelText(/Test Input/i);
    fireEvent.change(input, { target: { value: 'New Value' } });

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('New Value');
  });
});