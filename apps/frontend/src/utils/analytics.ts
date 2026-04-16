export const EVENTS = {
  PAGE_VIEW: "page_view",
  HERO_VIEW: "hero_view",
  BUTTON_CLICK: "button_click",
  NAV_LOGO_CLICK: "nav_logo_click",
  NAV_LINK_CLICK: "nav_link_click",
  MODAL_OPEN: "modal_open",
  CTA_CLICK: "cta_click",
  FORM_SUBMIT: "form_submit",
  COPY_TO_CLIPBOARD: "copy_to_clipboard"
} as const;

export type EventName = typeof EVENTS[keyof typeof EVENTS] | string;

export const trackEvent = (eventName: EventName, metadata: Record<string, any> = {}) => {
  console.log(`[Analytics Event]: ${eventName}`, {
    ...metadata,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'ssr',
  });
};
