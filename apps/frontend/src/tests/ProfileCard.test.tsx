import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileCard from '../components/ProfileCard';
import '@testing-library/jest-dom';

describe('ProfileCard Component', () => {
  const defaultProps = {
    name: 'Tobiloba',
    role: 'Lead Architect',
    image: '/assets/profile.jpg',
    stats: [
      { value: '3+', label: 'Years Exp.' },
      { value: '10+', label: 'Projects' }
    ]
  };

  it('renders the core identity details (name and role)', () => {
    render(<ProfileCard {...defaultProps} />);
    expect(screen.getByText('Tobiloba')).toBeInTheDocument();
    expect(screen.getByText('Lead Architect')).toBeInTheDocument();
  });

  it('renders all provided stats', () => {
    render(<ProfileCard {...defaultProps} />);
    expect(screen.getByText('3+')).toBeInTheDocument();
    expect(screen.getByText('Years Exp.')).toBeInTheDocument();
    expect(screen.getByText('10+')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('renders an image with the correct initial src and alternates to fallback on error', () => {
    render(<ProfileCard {...defaultProps} />);
    const image = screen.getByRole('img', { name: 'Tobiloba' });
    
    expect(image).toHaveAttribute('src', '/assets/profile.jpg');
    
    // Trigger error event to simulate loading failure
    fireEvent.error(image);
    
    // Expect src to have been changed to the inline SVG fallback
    expect(image.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
  });
});
