import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackEvent } from '../utils/analytics';

// Mock the API sync function
vi.mock('../utils/api', () => ({
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

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
) as any;

// Mock localStorage for consent
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Analytics Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    localStorageMock.setItem('tx_cookie_consent', 'true');
  });

  it('should dispatch events via fetch when enabled', async () => {
    await trackEvent('test_event', { foo: 'bar' });
    
    expect(global.fetch).toHaveBeenCalled();
    const [_, options] = (global.fetch as any).mock.calls[0];
    const body = JSON.parse(options.body);
    
    expect(body.event_type).toBe('test_event');
    expect(body.payload.foo).toBe('bar');
  });

  it('should still track page_view even without consent', async () => {
    localStorageMock.clear(); // Remove consent
    await trackEvent('page_view', { path: '/test' });
    
    expect(global.fetch).toHaveBeenCalled();
    const body = JSON.parse((global.fetch as any).mock.calls[0][1].body);
    expect(body.event_type).toBe('page_view');
  });
});
