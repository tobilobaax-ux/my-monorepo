import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WorkModal from '../components/modals/WorkModal';
import { trackEvent, EVENTS } from '../utils/analytics';
import '@testing-library/jest-dom';

// Mock analytics
vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(),
  EVENTS: {
    MODAL_OPEN: "modal_open",
    CTA_CLICK: "cta_click",
    FORM_SUBMIT: "form_submit"
  }
}));

const mockConfig = {
  title: "Start a Project",
  description: "Test Description",
  projectTypes: [
    { 
      id: "Deliver Project", 
      label: "Deliver Project", 
      description: "Build it", 
      iconType: "box",
      formSchema: [
        { name: "fullName", type: "text", placeholder: "Full Name", required: true },
        { name: "email", type: "email", placeholder: "Email Address", required: true },
        { name: "vision", type: "textarea", placeholder: "Tell me about the product vision...", required: true }
      ]
    }
  ]
};

describe('WorkModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Step 1 with project types from config', () => {
    render(<WorkModal isOpen={true} onClose={() => {}} config={mockConfig as any} />);
    
    expect(screen.getByText("Start a Project")).toBeInTheDocument();
    expect(screen.getByText("Deliver Project")).toBeInTheDocument();
    expect(trackEvent).toHaveBeenCalledWith(EVENTS.MODAL_OPEN, { type: 'work_with_me' });
  });

  it('transitions to Step 2 and renders dynamic fields from schema', async () => {
    render(<WorkModal isOpen={true} onClose={() => {}} config={mockConfig as any} />);
    
    fireEvent.click(screen.getByText("Deliver Project"));
    
    expect(trackEvent).toHaveBeenCalledWith(EVENTS.CTA_CLICK, { action: 'select_project_type', value: "Deliver Project" });
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
      expect(screen.getByText("Objective")).toBeInTheDocument();
    });
  });

  it('transitions to Step 3 after form submission', async () => {
    render(<WorkModal isOpen={true} onClose={() => {}} config={mockConfig as any} />);
    
    // Move to step 2
    fireEvent.click(screen.getByText("Deliver Project"));
    
    await waitFor(() => screen.getByPlaceholderText("Full Name"));
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText("Tell me about the product vision..."), { target: { value: 'Vision' } });
    
    // Submit
    fireEvent.click(screen.getByText("CONFIRM REQUEST"));
    
    await waitFor(() => {
      expect(trackEvent).toHaveBeenCalledWith(EVENTS.FORM_SUBMIT, { form: 'work_with_me', type: "Deliver Project" });
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Request Sent/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
