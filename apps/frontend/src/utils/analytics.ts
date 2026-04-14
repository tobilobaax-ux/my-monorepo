// @ts-ignore
import { EVENTS } from 'shared';

export const trackEvent = (eventName: string, metadata: Record<string, any> = {}) => {
  console.log(`[Analytics Event]: ${eventName}`, {
    ...metadata,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  });
};

export { EVENTS };
