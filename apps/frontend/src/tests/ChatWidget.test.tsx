import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ChatWidget from '../components/chatbot/ChatWidget';

// Mock chatbot config
vi.mock('../config/chatbot.json', () => ({
  default: {
    greeting: "Hi 👋 I can help you get started",
    helpText: "Get Help",
    guidanceText: "I can guide you to our best solutions. Check them out below.",
    ctaLabel: "Go to Solutions",
    ctaPath: "/solutions"
  }
}));

describe('ChatWidget', () => {
  it('should render the trigger button by default', () => {
    const { container } = render(
      <BrowserRouter>
        <ChatWidget />
      </BrowserRouter>
    );
    const trigger = container.querySelector('#chat-trigger');
    expect(trigger).toBeDefined();
    expect(trigger).not.toBeNull();
  });

  it('should show the modal when the trigger is clicked', async () => {
    const { container } = render(
      <BrowserRouter>
        <ChatWidget />
      </BrowserRouter>
    );
    
    const trigger = container.querySelector('#chat-trigger');
    if (trigger) fireEvent.click(trigger);

    // Wait for lazy load
    const greeting = await screen.findByText(/Hi 👋 I can help you get started/i);
    expect(greeting).toBeDefined();
  });

  it('should transition to step 2 when help button is clicked', async () => {
    const { container } = render(
      <BrowserRouter>
        <ChatWidget />
      </BrowserRouter>
    );
    
    const trigger = container.querySelector('#chat-trigger');
    if (trigger) fireEvent.click(trigger);
    
    const helpButton = await screen.findByText(/Get Help/i);
    fireEvent.click(helpButton);

    const guidance = await screen.findByText(/I can guide you to our best solutions/i);
    expect(guidance).toBeDefined();
  });
});
