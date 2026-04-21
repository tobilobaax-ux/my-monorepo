const API_BASE_URL = 'http://localhost:3001/api/v1';

export interface AdminStats {
  summary: {
    totalLeads: number;
    totalPageViews: number;
    totalCTAClicks: number;
    conversionRate: string;
  };
}

export const submitLead = async (formType: string, selectedOption: string, payload: Record<string, any>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/hero/lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formType,
        selectedOption,
        payload,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to submit lead');
    }
    return await response.json();
  } catch (error) {
    console.error('Lead submission error:', error);
    throw error;
  }
};

export const syncEvent = async (eventType: string, data: any = {}) => {
  try {
    await fetch(`${API_BASE_URL}/analytics/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        pageUrl: window.location.href,
        ctaId: data.ctaId || data.action || null,
        payload: data,
      }),
    });
  } catch (error) {
    console.warn('Analytics sync failed');
  }
};

export const verifyAdmin = async (passcode: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode })
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const passcode = localStorage.getItem('admin_passcode') || '';
  const response = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: {
      'x-admin-passcode': passcode
    }
  });
  if (!response.ok) throw new Error('Unauthorized or failed to fetch admin stats');
  return await response.json();
};
