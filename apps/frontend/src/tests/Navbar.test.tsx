// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import * as analytics from '../utils/analytics';
import '@testing-library/jest-dom';

// Mock the dynamic JSON import
vi.mock('../config/navbar.json', () => ({
  default: {
    logo: {
      text: 'Tobiloba Ayomide',
      href: '/',
    },
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ],
  },
}));

// Mock analytics utility
vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(),
  EVENTS: {
    NAV_LOGO_CLICK: 'nav_logo_click',
    NAV_LINK_CLICK: 'nav_link_click'
  }
}));

describe('Navbar — Slice 1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the logo text', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const logoLink = await screen.findByTestId('nav-logo-link');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveTextContent('Tobiloba Ayomide');
  });

  it('logo link navigates to correct route', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const link = await screen.findByTestId('nav-logo-link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders navigation links from config', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const homeLink = await screen.findByTestId('nav-link-home');
    const aboutLink = await screen.findByTestId('nav-link-about');

    expect(homeLink).toHaveTextContent('Home');
    expect(homeLink).toHaveAttribute('href', '/');
    expect(aboutLink).toHaveTextContent('About');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('emits nav_logo_click event when logo link is clicked', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const link = await screen.findByTestId('nav-logo-link');
    fireEvent.click(link);
    expect(analytics.trackEvent).toHaveBeenCalledWith(
      'nav_logo_click',
      expect.objectContaining({
        component: 'Navbar',
        text: 'Tobiloba Ayomide'
      })
    );
  });

  it('emits nav_link_click event when navigation link is clicked', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const link = await screen.findByTestId('nav-link-home');
    fireEvent.click(link);
    expect(analytics.trackEvent).toHaveBeenCalledWith(
      'nav_link_click',
      expect.objectContaining({
        component: 'Navbar',
        label: 'Home'
      })
    );
  });
});
