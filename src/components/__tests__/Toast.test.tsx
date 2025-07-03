import React from 'react';
import { render, screen } from '@testing-library/react';
import Toast from '../Toast';

describe('Toast', () => {
  it('renders info toast with icon', () => {
    render(<Toast type="info">Info message</Toast>);
    expect(screen.getByText('Info message')).toBeInTheDocument();
    expect(screen.getByText('ℹ️')).toBeInTheDocument();
  });
  it('renders success toast with icon', () => {
    render(<Toast type="success">Success!</Toast>);
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
  });
  it('renders error toast with icon', () => {
    render(<Toast type="error">Error!</Toast>);
    expect(screen.getByText('Error!')).toBeInTheDocument();
    expect(screen.getByText('❌')).toBeInTheDocument();
  });
}); 