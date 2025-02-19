import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('renders landing page content', () => {
    render(<HomePage />);
    
    // Check for main heading
    expect(screen.getByText("AI Developer's Launch Pad")).toBeInTheDocument();
    
    // Check for description
    expect(screen.getByText(/A modern full-stack starter template/)).toBeInTheDocument();
  });

  it('shows login button when user is not authenticated', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('View on GitHub')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
  });

  it('shows dashboard link when user is authenticated', () => {
    jest.spyOn(require('@auth0/nextjs-auth0/client'), 'useUser').mockImplementation(() => ({
      user: { name: 'Test User' },
      isLoading: false,
      error: null,
    }));

    render(<HomePage />);
    
    expect(screen.getByText('Welcome back, Test User!')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
}); 