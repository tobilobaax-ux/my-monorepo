import { syncEvent } from './api';

export const EVENTS = {
  PAGE_VIEW: 'page_view',
  CTA_CLICK: 'cta_click',
  MODAL_OPEN: 'modal_open',
  FORM_SUBMIT: 'form_submit',
  // Navbar specific events
  NAV_LOGO_CLICK: 'nav_logo_click',
  NAV_LINK_CLICK: 'nav_link_click',
};

import heroConfig from '../config/hero.json';

export const trackEvent = (eventType: string, data: any = {}) => {
  if (heroConfig.flags?.analytics_tracking_enabled === false) return;
  
  console.log(`[Analytics] ${eventType}:`, data);
  syncEvent(eventType, data);
};
