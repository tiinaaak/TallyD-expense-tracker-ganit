import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TallyD landing page', () => {
  render(<App />);
  expect(screen.getAllByText('TallyD').length).toBeGreaterThan(0);
});