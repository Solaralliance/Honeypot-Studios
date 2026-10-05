/**
 * First-party interaction analytics.
 *
 * Purposeful only: page views, CTA clicks, carousel engagement, blog opens
 * and form outcomes — the data the studio actually needs to know which
 * sections convert. Fire-and-forget; never blocks UI. No PII is sent.
 */

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const track = (event, meta = {}) => {
  try {
    fetch(`${API}/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, path: window.location.pathname, meta }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* analytics must never break the page */
  }
};
