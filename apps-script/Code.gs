/**
 * EKINOX — Tekirdağ Lead Webhook (Google Apps Script)
 *
 * KURULUM:
 * 1. Google Sheets CRM dosyanı aç (ekinox_tekirdag_crm.xlsx'i Google Sheets'e yükle).
 * 2. Uzantılar > Apps Script menüsünü aç.
 * 3. Bu kodun tamamını yapıştır (varsayılan kodu sil).
 * 4. SHEET_NAME'in CRM'deki sayfa adıyla eşleştiğinden emin ol ("Lead Listesi").
 * 5. Dağıt (Deploy) > Yeni dağıtım > Tür: Web uygulaması.
 *    - "Şu kullanıcı olarak çalıştır": Ben (kendi hesabın)
 *    - "Erişimi olan": Herkes
 * 6. Çıkan Web App URL'sini kopyala, Next.js .env.local içine
 *    GOOGLE_SHEETS_WEBHOOK_URL olarak yapıştır.
 */

var SHEET_NAME = "Lead Listesi";
var FIRST_DATA_ROW = 4; // CRM'de başlık 3. satırda, veri 4'ten başlıyor

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Sayfa bulunamadı: " + SHEET_NAME }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Kolon sırası CRM ile aynı (A–T). Skor (J) ve Segment (K) formülle
    // dolu olduğu için, biz onları DEĞERİ ile yazıyoruz — formül üzerine
    // yazılmasın diye yeni satırı en alta ekliyoruz.
    var row = [
      data.tarih || new Date(),
      data.adSoyad || "",
      data.telefon || "",
      data.eposta || "",
      data.sehir || "",
      data.ilgiAmaci || "",
      data.butce || "",
      data.zamanlama || "",
      data.gorusmeTercihi || "",
      data.skor !== undefined ? data.skor : "",
      data.segment || "",
      data.kaynak || "",
      data.kampanya || "",
      data.reklamAdi || "",
      data.arandi || "",
      data.whatsappAtildi || "",
      data.gorusmeTarihi || "",
      data.durum || "Yeni",
      data.not || "",
      data.sonrakiAksiyon || ""
    ];

    // İlk boş satırı bul (FIRST_DATA_ROW'dan itibaren B kolonuna göre)
    var lastRow = sheet.getLastRow();
    var targetRow = Math.max(lastRow + 1, FIRST_DATA_ROW);
    sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, row: targetRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: "Ekinox lead webhook aktif." }))
    .setMimeType(ContentService.MimeType.JSON);
}
