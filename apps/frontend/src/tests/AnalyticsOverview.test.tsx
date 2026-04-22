import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AnalyticsOverview from '../components/admin/AnalyticsOverview';
import '@testing-library/jest-dom';

// 1. Mock components using paths relative to the TEST file
vi.mock('../components/admin/AnalyticsChart', () => ({
  default: ({ title }: { title: string }) => <div data-testid="mock-chart">{title}</div>
}));
vi.mock('../components/admin/AnalyticsTable', () => ({
  default: ({ title }: { title: string }) => <div data-testid="mock-table">{title}</div>
}));

// 2. Mock API
vi.mock('../utils/api', () => ({
  fetchAdminStats: vi.fn(() => Promise.resolve({
    totalPageViews: 1000,
    totalCTAClicks: 200,
    totalModalOpens: 50,
    totalLeads: 10,
    conversionRate: "1.0",
    ctr: "20.0",
    modalRate: "25.0"
  })),
  fetchPageViewMetrics: vi.fn(() => Promise.resolve([{ url: '/test', count: 10 }])),
  fetchCTAMetrics: vi.fn(() => Promise.resolve([{ ctaId: 'test-btn', count: 5 }])),
}));

// 3. Mock Config (Relative path from src/tests to src/config)
vi.mock('../config/analytics-config.json', () => ({
  default: {
    settings: {
      title: "Test Dashboard",
      subtitle: "TEST",
      refreshInterval: 0,
      statusIndicator: { label: "Live", color: "bg-green-500" },
      efficiencyLabel: "Efficiency",
      scoreLabel: "Score"
    },
    flags: {
      disabledMessage: "Disabled",
      emptyState: { icon: "📊", title: "Empty", description: "Empty Desc" }
    },
    iconLibrary: { eye: "path" },
    metrics: [{ id: "totalPageViews", label: "Views", icon: "eye", description: "Desc" }],
    charts: [{ id: "funnel", title: "Chart Title", items: [] }],
    tables: [{ id: "t1", title: "Table Title", headers: ["H1", "H2"], dataSource: "pageViews" }]
  }
}));

vi.mock('../config/hero.json', () => ({
  default: { flags: { analytics_dashboard_enabled: true } }
}));

describe('AnalyticsOverview Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('admin_passcode', 'test');
  });

  it('renders fixed stats and metrics after loading', async () => {
    render(<AnalyticsOverview />);
    
    // Wait for the loading state to finish and titles to appear
    await waitFor(() => {
      expect(screen.getByText("Test Dashboard")).toBeInTheDocument();
      expect(screen.getByText("1,000")).toBeInTheDocument();
      expect(screen.getByText("Views")).toBeInTheDocument();
    });
  });

  it('renders charts and tables safely using mock data', async () => {
    render(<AnalyticsOverview />);
    
    await waitFor(() => {
      expect(screen.getByTestId("mock-chart")).toBeInTheDocument();
      expect(screen.getByTestId("mock-table")).toBeInTheDocument();
      expect(screen.getByText("Chart Title")).toBeInTheDocument();
      expect(screen.getByText("Table Title")).toBeInTheDocument();
    });
  });
});
