// UTM yakalama — reklamdan gelen kişinin hangi kampanya/reklamdan geldiğini
// URL'deki etiketlerden okur. Bu veri lead ile birlikte CRM'e yazılır ki
// "hangi reklam satış getiriyor" sorusunu cevaplayabilelim.

export type UtmData = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  landing_url: string;
  referrer: string;
};

export function captureUtm(): UtmData {
  if (typeof window === "undefined") {
    return {
      utm_source: "", utm_medium: "", utm_campaign: "",
      utm_content: "", utm_term: "", landing_url: "", referrer: "",
    };
  }
  const params = new URLSearchParams(window.location.search);
  const get = (k: string) => params.get(k) ?? "";
  return {
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_content: get("utm_content"),
    utm_term: get("utm_term"),
    landing_url: window.location.href,
    referrer: document.referrer || "",
  };
}
