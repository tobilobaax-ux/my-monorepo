const BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001';
const API_BASE_URL = `${BASE_URL}/api/v1`;

export interface AdminStats {
  summary: {
    totalLeads: number;
    totalPageViews: number;
    totalCTAClicks: number;
    totalModalOpens: number;
    conversionRate: string;
    ctr: string;
    modalRate: string;
  };
}

export const verifyAdmin = async (passcode: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode })
  });
  const data = await response.json();
  return data.success === true;
};

export const fetchAdminStats = async (passcode: string): Promise<AdminStats> => {
  const response = await fetch(`${API_BASE_URL}/admin/analytics/summary`, {
    headers: { 'x-admin-passcode': passcode }
  });
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};

export const fetchPageViewMetrics = async (passcode: string) => {
  const response = await fetch(`${API_BASE_URL}/admin/analytics/pageviews`, {
    headers: { 'x-admin-passcode': passcode }
  });
  if (!response.ok) throw new Error('Failed to fetch pageviews');
  return response.json();
};

export const fetchCTAMetrics = async (passcode: string) => {
  const response = await fetch(`${API_BASE_URL}/admin/analytics/cta`, {
    headers: { 'x-admin-passcode': passcode }
  });
  if (!response.ok) throw new Error('Failed to fetch CTA metrics');
  return response.json();
};

export const submitLead = async (formType: string, selectedOption: string, payload: any) => {
  const response = await fetch(`${API_BASE_URL}/hero/lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formType, selectedOption, payload })
  });
  if (!response.ok) throw new Error('Failed to submit lead');
  return response.json();
};

export const syncEvent = async (eventType: string, data: any) => {
  try {
    await fetch(`${API_BASE_URL}/analytics/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType, ...data }),
    });
  } catch (err) {
    console.error("Analytics sync error", err);
  }
};
