import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackEvent } from './analytics';

// Mock the API sync function
vi.mock('./api', () => ({
  syncEvent: vi.fn(),
}));

// Mock the config
vi.mock('../config/hero.json', () => ({
  default: {
    flags: {
      analytics_tracking_enabled: true,
    },
  },
}));

import { syncEvent } from './api';

describe('Analytics Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track events when enabled', () => {
    trackEvent('test_event', { foo: 'bar' });
    expect(syncEvent).toHaveBeenCalledWith('test_event', { foo: 'bar' });
  });

  it('should sync events to the backend', () => {
    trackEvent('page_view');
    expect(syncEvent).toHaveBeenCalledWith('page_view', {});
  });
});
