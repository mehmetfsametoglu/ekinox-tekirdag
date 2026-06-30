// Reklam ölçüm event'leri — Meta Pixel ve Google Tag (gtag).
// Her event, funnel'ın hangi aşamasında kaç kişi olduğunu ölçer.
// Pixel/Tag ID'leri layout.tsx içindeki script'lerde tanımlanır.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type EventName =
  | "PageView"
  | "LeadFormStart"
  | "LeadSubmit"
  | "WhatsAppClick"
  | "PDFDownload"
  | "QualifiedLead";

export function track(event: EventName, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  // Meta Pixel
  if (window.fbq) {
    // standart event'ler Lead, diğerleri custom
    if (event === "LeadSubmit") {
      window.fbq("track", "Lead", data);
    } else {
      window.fbq("trackCustom", event, data);
    }
  }

  // Google Tag (GA4)
  if (window.gtag) {
    window.gtag("event", event, data ?? {});
  }
}
