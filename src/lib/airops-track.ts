// Client-side AirOps event tracker. Fire-and-forget; never blocks navigation.

const SESSION_KEY = "airops_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export type AirOpsEvent =
  | { event: "page_view"; path: string }
  | { event: "project_view"; path: string; slug: string }
  | { event: "outbound_click"; path: string; href: string };

export function trackAirOps(evt: AirOpsEvent) {
  if (typeof window === "undefined") return;
  const payload = {
    ...evt,
    referrer: document.referrer || null,
    userAgent: navigator.userAgent,
    locale: navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  };

  try {
    const body = JSON.stringify(payload);
    const url = "/api/public/airops-track";
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(url, blob)) return;
    }
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // swallow – tracking must never break the app
  }
}
