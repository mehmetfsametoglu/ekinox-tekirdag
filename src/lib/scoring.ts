// Lead scoring — landing page formundan gelen cevaplara göre otomatik puan.
// Bu puanlama, CRM (Excel) dosyasındaki formüllerle BİREBİR aynıdır.
// Değiştirilirse iki yerde de güncellenmeli.

export type LeadInput = {
  name: string;
  phone: string;
  email?: string;
  city: string;
  interest: "self" | "family" | "investment" | "info" | "";
  budget: "4m+" | "3-4m" | "unsure" | "";
  timeline: "0-3" | "3-6" | "research" | "";
  contactPref: "whatsapp" | "phone" | "";
};

export type Segment = "SICAK" | "ILIK" | "SOGUK";

const INTEREST_SCORE: Record<string, number> = {
  self: 35,        // Kendim için (birincil hedef)
  family: 25,      // Aile büyüğüm için
  investment: 20,  // Yatırım amaçlı
  info: -15,       // Sadece bilgi almak istiyorum
};

const BUDGET_SCORE: Record<string, number> = {
  "4m+": 30,    // 4 milyon TL üzeri
  "3-4m": 25,   // 3 - 4 milyon TL
  unsure: -10,  // Henüz net değil
};

const TIMELINE_SCORE: Record<string, number> = {
  "0-3": 30,      // 1 - 3 ay içinde
  "3-6": 15,      // 3 - 6 ay içinde
  research: -10,  // Sadece araştırıyorum
};

export function scoreLead(lead: LeadInput): number {
  let score = 0;
  score += INTEREST_SCORE[lead.interest] ?? 0;
  score += BUDGET_SCORE[lead.budget] ?? 0;
  score += TIMELINE_SCORE[lead.timeline] ?? 0;
  if (lead.email && lead.email.trim() !== "") score += 5;
  return score;
}

export function segmentFor(score: number): Segment {
  if (score >= 70) return "SICAK";
  if (score >= 40) return "ILIK";
  return "SOGUK";
}

// İnsan-okunur Türkçe etiketler (CRM'e yazılırken kullanılır)
export const INTEREST_LABEL: Record<string, string> = {
  self: "Kendim için",
  family: "Aile büyüğüm için",
  investment: "Yatırım amaçlı",
  info: "Sadece bilgi almak istiyorum",
};
export const BUDGET_LABEL: Record<string, string> = {
  "4m+": "4 milyon TL üzeri",
  "3-4m": "3 - 4 milyon TL",
  unsure: "Henüz net değil",
};
export const TIMELINE_LABEL: Record<string, string> = {
  "0-3": "1 - 3 ay içinde",
  "3-6": "3 - 6 ay içinde",
  research: "Sadece araştırıyorum",
};
export const CONTACT_LABEL: Record<string, string> = {
  whatsapp: "WhatsApp",
  phone: "Telefon",
};

export const SEGMENT_LABEL: Record<Segment, string> = {
  SICAK: "🔴 SICAK",
  ILIK: "🟡 ILIK",
  SOGUK: "⚪ SOĞUK",
};
