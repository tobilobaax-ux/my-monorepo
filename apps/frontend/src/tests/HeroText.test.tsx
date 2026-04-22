import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroText from '../components/HeroText';
import '@testing-library/jest-dom';

describe('HeroText Component', () => {
  const defaultProps = {
    heading: 'Build Better Digital Experiences',
    subheading: 'Simple, fast, and beautiful',
    intro: 'This is the hero intro text.',
  };

  it('renders the main heading correctly', () => {
    render(<HeroText {...defaultProps} />);
    expect(screen.getByText('Build Better Digital Experiences')).toBeInTheDocument();
  });

  it('renders dynamic badge when provided', () => {
    render(<HeroText {...defaultProps} badge="Open to roles" />);
    expect(screen.getByText('Open to roles')).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<HeroText {...defaultProps} />);
    expect(screen.getByRole('button', { name: /work with me/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connect with me/i })).toBeInTheDocument();
  });

  it('calls click handlers when buttons are clicked', () => {
    const onWorkClick = vi.fn();
    const onConnectClick = vi.fn();
    render(<HeroText {...defaultProps} onWorkClick={onWorkClick} onConnectClick={onConnectClick} />);
    
    fireEvent.click(screen.getByRole('button', { name: /work with me/i }));
    expect(onWorkClick).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole('button', { name: /connect with me/i }));
    expect(onConnectClick).toHaveBeenCalledOnce();
  });
});
