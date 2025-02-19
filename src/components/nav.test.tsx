import { render, screen } from '@testing-library/react';
import { Nav } from './nav';

describe('Nav', () => {
  it('renders the navigation bar', () => {
    render(<Nav />);
    
    // Check if the logo text is present
    expect(screen.getByText("AI Developer's Launch Pad")).toBeInTheDocument();
    
    // Check if the sign-in button is present when not logged in
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
}); 