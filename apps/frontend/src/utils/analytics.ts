import { syncEvent } from './api';
import heroConfig from '../config/hero.json';

export const EVENTS = {
  PAGE_VIEW: 'page_view',
  CTA_CLICK: 'cta_click',
  MODAL_OPEN: 'modal_open',
  FORM_SUBMIT: 'form_submit',
};

const getSessionId = () => {
  if (typeof window === 'undefined') return '';
  let sessionId = sessionStorage.getItem('tx_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('tx_session_id', sessionId);
  }
  return sessionId;
};

export const trackEvent = async (eventType: string, data: any = {}) => {
  if (heroConfig.flags?.analytics_tracking_enabled === false) return;

  const consent = typeof localStorage !== 'undefined' ? localStorage.getItem('tx_cookie_consent') : null;
  if (!consent && eventType !== EVENTS.PAGE_VIEW) return;

  const BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001';
  const API_URL = `${BASE_URL}/api/v1/analytics/events`;

  // Standardize on snake_case to match DB columns exactly
  const eventPayload = {
    event_type: eventType,
    page_url: data.path || window.location.pathname,
    cta_id: data.ctaId || data.action || data.buttonId || null,
    session_id: getSessionId(),
    user_agent: navigator.userAgent,
    payload: data,
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
      keepalive: true,
    });
  } catch (err) {
    syncEvent(eventType, data);
  }
};
