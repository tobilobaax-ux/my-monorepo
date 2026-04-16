import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConnectModal from '../components/modals/ConnectModal';
import { trackEvent, EVENTS } from '../utils/analytics';
import '@testing-library/jest-dom';

// Mock analytics
vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(),
  EVENTS: {
    MODAL_OPEN: "modal_open",
    CTA_CLICK: "cta_click",
    COPY_TO_CLIPBOARD: "copy_to_clipboard"
  }
}));

const mockConfig = {
  title: "Let's Connect",
  description: "Test Description",
  email: "hello@test.com"
};

const mockSocials = [
  { platform: "LinkedIn", url: "https://linkedin.com", description: "Pro Network" },
  { platform: "Twitter", url: "https://twitter.com", description: "Updates" }
];

describe('ConnectModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it('renders social links and analytics tracking works', () => {
    render(
      <ConnectModal 
        isOpen={true} 
        onClose={() => {}} 
        config={mockConfig as any} 
        socials={mockSocials} 
      />
    );
    
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("hello@test.com")).toBeInTheDocument();

    fireEvent.click(screen.getByText("LinkedIn"));
    expect(trackEvent).toHaveBeenCalledWith(EVENTS.CTA_CLICK, { platform: "LinkedIn", url: "https://linkedin.com" });
  });

  it('handles email copy utility correctly', () => {
    render(
      <ConnectModal 
        isOpen={true} 
        onClose={() => {}} 
        config={mockConfig as any} 
        socials={mockSocials} 
      />
    );
    
    const copyButton = screen.getByText("hello@test.com").closest('button');
    fireEvent.click(copyButton!);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello@test.com");
    expect(trackEvent).toHaveBeenCalledWith(EVENTS.COPY_TO_CLIPBOARD, { target: 'email', value: "hello@test.com" });
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });
});
