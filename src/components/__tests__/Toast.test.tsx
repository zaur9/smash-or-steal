import { render, screen } from '@testing-library/react';
import Toast from '../Toast';

describe('Toast', () => {
  it('renders message', () => {
    render(<Toast type="info">Info message</Toast>);
    expect(screen.getByText('Info message')).toBeTruthy();
  });
  it('renders success toast', () => {
    render(<Toast type="success">Success!</Toast>);
    expect(screen.getByText('Success!')).toBeTruthy();
  });
  it('renders error toast', () => {
    render(<Toast type="error">Error!</Toast>);
    expect(screen.getByText('Error!')).toBeTruthy();
  });
}); 