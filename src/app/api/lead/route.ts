import { NextRequest, NextResponse } from "next/server";
import {
  scoreLead,
  segmentFor,
  type LeadInput,
  INTEREST_LABEL,
  BUDGET_LABEL,
  TIMELINE_LABEL,
  CONTACT_LABEL,
  SEGMENT_LABEL,
} from "@/lib/scoring";

// Bu API route formdan gelen lead'i alır, sunucu tarafında SKORU YENİDEN hesaplar
// (güvenlik: tarayıcıdan gelen skora güvenmeyiz), sonra Google Sheets'e yazar.
//
// Google Sheets'e yazmak için iki yöntem var; burada en kolayı olan
// "Google Apps Script Web App" yöntemini kullanıyoruz:
//   1. Google Sheet'inde Uzantılar > Apps Script aç
//   2. apps-script/Code.gs içeriğini yapıştır, Web App olarak deploy et
//   3. Çıkan URL'yi .env.local içine GOOGLE_SHEETS_WEBHOOK_URL olarak koy
//
// Bu yöntem, Google servis hesabı/kimlik bilgisi gerektirmediği için en yalın olanıdır.

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadInput & {
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
      utm_content?: string;
      utm_term?: string;
      landing_url?: string;
      referrer?: string;
      consent?: boolean;
    };

    // Zorunlu alan kontrolü
    if (!body.name || !body.phone || !body.city || !body.consent) {
      return NextResponse.json(
        { ok: false, error: "Zorunlu alanlar eksik." },
        { status: 400 }
      );
    }

    // Skoru sunucuda yeniden hesapla
    const score = scoreLead(body);
    const segment = segmentFor(score);

    // CRM'e yazılacak satır — kolon sırası Excel CRM ile aynı
    const row = {
      tarih: new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" }),
      adSoyad: body.name,
      telefon: body.phone,
      eposta: body.email ?? "",
      sehir: body.city,
      ilgiAmaci: INTEREST_LABEL[body.interest] ?? "",
      butce: BUDGET_LABEL[body.budget] ?? "",
      zamanlama: TIMELINE_LABEL[body.timeline] ?? "",
      gorusmeTercihi: CONTACT_LABEL[body.contactPref] ?? "",
      skor: score,
      segment: SEGMENT_LABEL[segment],
      kaynak: body.utm_source ?? "",
      kampanya: body.utm_campaign ?? "",
      reklamAdi: body.utm_content ?? "",
      // takip kolonları boş başlar (satış ekibi doldurur)
      arandi: "",
      whatsappAtildi: "",
      gorusmeTarihi: "",
      durum: "Yeni",
      not: "",
      sonrakiAksiyon: "",
    };

    // Google Sheets'e yaz (Apps Script webhook)
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(row),
        });
      } catch (e) {
        // Sheets yazımı başarısız olsa bile kullanıcıya hata göstermeyiz;
        // log'a düşer, lead kaybolmasın diye burada yedek alınabilir.
        console.error("Sheets webhook hatası:", e);
      }
    } else {
      console.warn("GOOGLE_SHEETS_WEBHOOK_URL tanımlı değil — lead sadece log'a yazıldı:", row);
    }

    return NextResponse.json({
      ok: true,
      score,
      segment,
      qualified: segment === "SICAK" || segment === "ILIK",
    });
  } catch (e) {
    console.error("Lead API hatası:", e);
    return NextResponse.json(
      { ok: false, error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}
