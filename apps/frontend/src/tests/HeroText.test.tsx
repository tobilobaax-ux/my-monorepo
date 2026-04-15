import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HeroText from '../components/HeroText';
import '@testing-library/jest-dom';

describe('HeroText Component', () => {
  const defaultProps = {
    heading: 'Build Better Digital Experiences',
    subheading: 'Simple, fast, and beautiful',
    intro: 'This is the hero intro text.',
  };

  it('renders the main heading correctly without comma split', () => {
    render(<HeroText {...defaultProps} />);
    expect(screen.getByText('Build Better Digital Experiences')).toBeInTheDocument();
  });

  it('renders the main heading correctly with comma split', () => {
    render(<HeroText {...defaultProps} heading="Hello World, This is a test" />);
    // first part should have comma appended, second part rendered in second span
    expect(screen.getByText('Hello World,')).toBeInTheDocument();
    expect(screen.getByText('This is a test')).toBeInTheDocument();
  });

  it('renders subheading and intro', () => {
    render(<HeroText {...defaultProps} />);
    expect(screen.getByText('Simple, fast, and beautiful')).toBeInTheDocument();
    expect(screen.getByText('This is the hero intro text.')).toBeInTheDocument();
  });

  it('does not render badge if not specifically provided', () => {
    render(<HeroText {...defaultProps} />);
    // Attempting to find something related to the badge should fail.
    // The closest check is ensuring text like 'available' isn't there, or testing the dom structure.
    const badgeText = screen.queryByText(/Available for new projects/i);
    expect(badgeText).not.toBeInTheDocument();
  });

  it('renders the dynamic badge when provided via config', () => {
    render(<HeroText {...defaultProps} badge="Open to roles" />);
    expect(screen.getByText('Open to roles')).toBeInTheDocument();
  });
});
