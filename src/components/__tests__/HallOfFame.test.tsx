import { render, screen } from '@testing-library/react';
import HallOfFame from '../HallOfFame';

describe('HallOfFame', () => {
  it('renders empty message if no winners', () => {
    render(<HallOfFame hallOfFame={[]} />);
    expect(screen.getByText(/Be the first to win/i)).toBeTruthy();
  });
  it('renders list of winners', () => {
    const winners = ['0x123', '0x456'];
    render(<HallOfFame hallOfFame={winners} />);
    expect(screen.getByText(/0x123...x123/i)).toBeTruthy();
    expect(screen.getByText(/0x456...x456/i)).toBeTruthy();
  });
}); 