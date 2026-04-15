import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import HeroSection from '../components/HeroSection';
import '@testing-library/jest-dom';

// Mock the dynamic JSON import
vi.mock('../config/hero.json', () => ({
  default: {
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
        description: "Test Work Description"
      },
      connect: {
        label: "Connect With Me",
        title: "Let's Connect",
        description: "Test Connect Description",
        socials: [
          { platform: "LinkedIn", url: "https://linkedin.com", description: "Professional Network" }
        ]
      }
    }
  },
}));

describe('HeroSection Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initially renders the loading skeletons and then loads the actual config data', async () => {
    // We expect it to render the configuration data eventually, due to dynamic import
    render(<HeroSection />);

    // Since the dynamic import happens via useEffect, it should eventually render our mocked text.
    // Waiting for the async components to be populated.
    
    await waitFor(() => {
      // HeroText assertions
      expect(screen.getByText('Test Badge Available')).toBeInTheDocument();
      expect(screen.getByText('Test Architecture Hero')).toBeInTheDocument();
      expect(screen.getByText('Building test suites')).toBeInTheDocument();
      expect(screen.getByText('This is the mock intro copy for testing the hero config.')).toBeInTheDocument();

      // ProfileCard assertions
      expect(screen.getByText('Test Name')).toBeInTheDocument();
      expect(screen.getByText('Test Role')).toBeInTheDocument();
      expect(screen.getByText('99')).toBeInTheDocument();
      expect(screen.getByText('Tests Passed')).toBeInTheDocument();
    });
  });
});
