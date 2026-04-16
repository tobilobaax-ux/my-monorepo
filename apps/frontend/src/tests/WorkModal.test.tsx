import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WorkModal from '../components/modals/WorkModal';
import { trackEvent, EVENTS } from '../utils/analytics';
import '@testing-library/jest-dom';

// Type definitions for the test
interface ProjectType {
  id: string;
  label: string;
  description: string;
  iconType: string;
}

interface MockConfig {
  title: string;
  description: string;
  projectTypes: ProjectType[];
}

// Mock analytics
vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(),
  EVENTS: {
    MODAL_OPEN: "modal_open",
    CTA_CLICK: "cta_click",
    FORM_SUBMIT: "form_submit"
  }
}));

const mockConfig: MockConfig = {
  title: "Start a Project",
  description: "Test Description",
  projectTypes: [
    { id: "Product", label: "Product", description: "Build it", iconType: "box" },
    { id: "Strategy", label: "Strategy", description: "Plan it", iconType: "consultation" }
  ]
};

describe('WorkModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Step 1 with project types when opened', () => {
    render(<WorkModal isOpen={true} onClose={() => {}} config={mockConfig as any} />);
    
    expect(screen.getByText("Start a Project")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Strategy")).toBeInTheDocument();
    expect(trackEvent).toHaveBeenCalledWith(EVENTS.MODAL_OPEN, { type: 'work_with_me' });
  });

  it('transitions to Step 2 when a project type is selected', async () => {
    render(<WorkModal isOpen={true} onClose={() => {}} config={mockConfig as any} />);
    
    fireEvent.click(screen.getByText("Product"));
    
    expect(trackEvent).toHaveBeenCalledWith(EVENTS.CTA_CLICK, { action: 'select_project_type', value: "Product" });
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      expect(screen.getByText("Let's get started")).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('transitions to Step 3 after form submission', async () => {
    render(<WorkModal isOpen={true} onClose={() => {}} config={mockConfig as any} />);
    
    // Move to step 2
    fireEvent.click(screen.getByText("Product"));
    
    await waitFor(() => screen.getByPlaceholderText("Full Name"));
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText("Project vision..."), { target: { value: 'Great project' } });
    
    // Submit
    fireEvent.click(screen.getByText("Send Message"));
    
    expect(trackEvent).toHaveBeenCalledWith(EVENTS.FORM_SUBMIT, { form: 'work_with_me', type: "Product" });
    
    await waitFor(() => {
      expect(screen.getByText("Sent!")).toBeInTheDocument();
      expect(screen.getByText(/I'll reach out about your/)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
