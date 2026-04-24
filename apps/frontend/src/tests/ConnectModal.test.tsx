import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConnectModal from '../components/modals/ConnectModal';
import { trackEvent, EVENTS } from '../utils/analytics';
import '@testing-library/jest-dom';

// Mock analytics
vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(),
  EVENTS: {
    VIEWED: "Viewed Event",
    CLICKED: "Clicked Event",
    COMPLETED: "Completed Event",
    ABANDONED: "Abandoned Event"
  }
}));

// Mock API so no real network calls are made in CI
vi.mock('../utils/api', () => ({
  submitLead: vi.fn().mockResolvedValue({ success: true }),
}));

// Stub window.alert — jsdom doesn't implement it
vi.stubGlobal('alert', vi.fn());

const mockConfig = {
  title: "Let's Connect",
  description: "Test Description",
  email: "hello@test.com",
  options: [
    {
      id: "Site Audit",
      label: "Site Audit",
      description: "Review",
      iconType: "audit",
      formSchema: [
        { name: "fullName", type: "text", placeholder: "Full Name", required: true },
        { name: "url", type: "text", placeholder: "Project URL", required: true }
      ]
    }
  ]
};

describe('ConnectModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('alert', vi.fn());
  });

  it('renders Step 1 with professional options', () => {
    render(<ConnectModal isOpen={true} onClose={() => {}} config={mockConfig as any} />);
    expect(screen.getByText("Site Audit")).toBeInTheDocument();
    expect(trackEvent).toHaveBeenCalledWith(EVENTS.CLICKED, expect.objectContaining({ ctaId: 'Connect With Me' }));
  });

  it('transitions to Step 2 and renders dynamic fields', async () => {
    render(<ConnectModal isOpen={true} onClose={() => {}} config={mockConfig as any} />);
    
    // Select path
    fireEvent.click(screen.getByText("Site Audit"));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      expect(trackEvent).toHaveBeenCalledWith(EVENTS.CLICKED, expect.objectContaining({ ctaId: /Connect With Me - Site Audit option Clicked/i }));
    });
  });

  it('submits form and shows success state', async () => {
    render(<ConnectModal isOpen={true} onClose={() => {}} config={mockConfig as any} />);
    
    // Step 1
    fireEvent.click(screen.getByText("Site Audit"));
    
    // Step 2
    await waitFor(() => screen.getByPlaceholderText("Full Name"));
    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText("Project URL"), { target: { value: 'https://test.com' } });
    
    // Submit - Using partial match for the button which contains an icon
    const submitBtn = screen.getByRole('button', { name: /SUBMIT REQUEST/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/Request Sent/i)).toBeInTheDocument();
      expect(trackEvent).toHaveBeenCalledWith(EVENTS.COMPLETED, expect.objectContaining({ ctaId: /Connect With Me - Site Audit Journey Completed/i }));
    }, { timeout: 2000 });
  });
});
