import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import HeroSection from '../components/HeroSection';
import '@testing-library/jest-dom';

const mockConfig = {
  heroText: {
    badge: 'Test Badge Available',
    heading: 'Test Architecture Hero',
    subheading: 'Building test suites',
    intro: 'This is the mock intro copy for testing the hero config.',
  },
  profile: {
    name: 'Test Name',
    role: 'Test Role',
    image: '/test-img.jpg',
    stats: [
      { value: '99', label: 'Tests Passed' }
    ]
  },
  modals: {
    work: {
      label: "Work With Me",
      title: "Start a Project",
      description: "Test Work Description",
      projectTypes: []
    },
    connect: {
      label: "Connect With Me",
      title: "Let's Connect",
      description: "Test Connect Description",
      email: "test@example.com",
      options: []
    }
  },
  footer: {
    owner: "Test Owner",
    links: []
  }
};

describe('HeroSection Component', () => {
  it('renders correctly with external configuration', () => {
    render(<HeroSection externalConfig={mockConfig as any} />);
    
    expect(screen.getByText('Test Badge Available')).toBeInTheDocument();
    expect(screen.getByText('Test Architecture Hero')).toBeInTheDocument();
    expect(screen.getByText('Test Name')).toBeInTheDocument();
  });

  it('renders skeleton when config is null', () => {
    const { container } = render(<HeroSection externalConfig={null} />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
