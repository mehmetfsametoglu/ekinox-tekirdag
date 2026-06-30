# Ekinox Tekirdağ — Kurulum ve Yayına Alma Rehberi

Bu rehber, hazır kodu canlıya almak için izlenecek adımları sırayla anlatır.
Orta seviye teknik bilgisi olan biri 1-2 saatte tamamlayabilir.

---

## Genel Bakış

Sistem 3 parçadan oluşur:

```
[Reklam] → [Landing Page (Next.js)] → [Form] → [API] → [Google Sheets CRM] → [Satış Ekibi]
                                                  ↓
                                          [Meta Pixel / GA4 ölçüm]
```

İhtiyacın olan hesaplar:
- GitHub hesabı (kodu yüklemek için) — ücretsiz
- Vercel hesabı (siteyi yayınlamak için) — ücretsiz
- Google hesabı (CRM Sheet + Apps Script) — ücretsiz
- Meta Business hesabı (Pixel için) — reklam verince zaten lazım
- Google Analytics hesabı (GA4 için) — ücretsiz

---

## ADIM 1 — Google Sheets CRM'i hazırla

1. `ekinox_tekirdag_crm.xlsx` dosyasını Google Drive'a yükle.
2. Sağ tık > "Birlikte aç" > "Google E-Tablolar" — Drive otomatik dönüştürür.
3. Dönüşen dosyayı aç. Sayfa adının **"Lead Listesi"** olduğunu doğrula.
   (Apps Script bu ismi arıyor; farklıysa kodu da güncelle.)

---

## ADIM 2 — Apps Script ile webhook kur

1. Google Sheets içinde: **Uzantılar > Apps Script**.
2. Açılan editördeki varsayılan kodu sil.
3. `apps-script/Code.gs` dosyasının içeriğini yapıştır.
4. Üstten **Dağıt (Deploy) > Yeni dağıtım**.
5. Dişli simgesi > **Web uygulaması** seç.
   - Açıklama: "Ekinox lead webhook"
   - Şu kullanıcı olarak çalıştır: **Ben** (kendi hesabın)
   - Erişimi olan: **Herkes**
6. **Dağıt** > izinleri onayla.
7. Çıkan **Web App URL**'sini kopyala (https://script.google.com/macros/s/.../exec).
   Bu URL'yi Adım 4'te kullanacaksın.

> Test: URL'yi tarayıcıda aç. `{"ok":true,"message":"Ekinox lead webhook aktif."}`
> görüyorsan webhook çalışıyor.

---

## ADIM 3 — Takip ID'lerini gir

`src/app/layout.tsx` dosyasını aç. En üstte iki satır var:

```ts
const META_PIXEL_ID = "BURAYA_META_PIXEL_ID";
const GA4_ID = "BURAYA_GA4_OLCUM_ID";
```

- **Meta Pixel ID:** Meta Events Manager > Veri Kaynakları > Pixel'inin ID'si (sadece rakam).
- **GA4 ID:** Google Analytics > Yönetici > Veri Akışları > "G-" ile başlayan ölçüm kimliği.

Henüz reklam hesabın yoksa bu adımı sonraya bırakabilirsin; ID girilmezse
sayfa yine çalışır, sadece ölçüm yapılmaz.

`src/app/page.tsx` dosyasında da WhatsApp numarasını gir:
```ts
const WA_NUMBER = "905XXXXXXXXX";  // gerçek numara, 90 ile başlasın
```

---

## ADIM 4 — Yerelde test et (opsiyonel ama önerilir)

Bilgisayarında Node.js 18+ kurulu olmalı (https://nodejs.org).

```bash
cd ekinox-tekirdag
npm install
cp .env.local.example .env.local
# .env.local içine GOOGLE_SHEETS_WEBHOOK_URL=... yapıştır (Adım 2'deki URL)
npm run dev
```

Tarayıcıda http://localhost:3000 aç. Formu doldur, gönder.
Google Sheet'inde yeni satır belirmeli. Beliriyorsa sistem çalışıyor.

UTM testi: http://localhost:3000?utm_source=test&utm_campaign=deneme&utm_content=reklam1
adresiyle aç, form gönder — Sheet'te Kaynak/Kampanya/Reklam Adı kolonları dolmalı.

---

## ADIM 5 — Yayına al (Vercel)

1. Kodu GitHub'a yükle:
   ```bash
   git init
   git add .
   git commit -m "Ekinox Tekirdağ landing"
   # GitHub'da yeni repo oluştur, sonra:
   git remote add origin https://github.com/KULLANICI/ekinox-tekirdag.git
   git push -u origin main
   ```
2. https://vercel.com > "Add New Project" > GitHub repo'sunu seç.
3. **Environment Variables** bölümüne ekle:
   - `GOOGLE_SHEETS_WEBHOOK_URL` = (Adım 2'deki URL)
4. **Deploy** butonuna bas. Birkaç dakikada site canlı olur.
5. Vercel sana bir adres verir (örn: ekinox-tekirdag.vercel.app).

---

## ADIM 6 — Kendi domain'ini bağla (opsiyonel)

1. Vercel proje ayarları > **Domains**.
2. Domain'ini yaz (örn: tekirdagyasamprojesi.com).
3. Vercel'in verdiği DNS kayıtlarını domain sağlayıcına ekle.
4. Birkaç saat içinde aktif olur.

---

## YAYINA ALMADAN ÖNCE KONTROL LİSTESİ

- [ ] **Asaf Bey "geliştirici Ekinox" / "fikri geliştiren" ifadesini onayladı mı?**
- [ ] WhatsApp numarası gerçek mi? (`page.tsx`)
- [ ] Meta Pixel ve GA4 ID girildi mi? (`layout.tsx`)
- [ ] Google Sheets webhook URL'si Vercel'e eklendi mi?
- [ ] Konsept görseller eklendi mi? (hero ve lokasyon placeholder'ları)
- [ ] Lokasyon metni gerçek bilgiyle dolduruldu mu? (`page.tsx`, LOCATION bölümü)
- [ ] KVKK / Gizlilik Politikası sayfası hazır mı? (şu an link boş "#")
- [ ] Test formu gönderip Sheet'e düştüğü doğrulandı mı?
- [ ] Mobilde açılıp test edildi mi? (trafiğin çoğu mobil gelecek)

---

## DEĞİŞTİRİLECEK ALANLAR ÖZET TABLOSU

| Ne | Nerede | Şu anki değer |
|---|---|---|
| WhatsApp numarası | `src/app/page.tsx` | `905XXXXXXXXX` |
| Meta Pixel ID | `src/app/layout.tsx` | `BURAYA_META_PIXEL_ID` |
| GA4 ID | `src/app/layout.tsx` | `BURAYA_GA4_OLCUM_ID` |
| Sheets webhook | Vercel env / `.env.local` | (boş) |
| Lokasyon metni | `src/app/page.tsx` (LOCATION) | placeholder |
| Hero görseli | `src/app/page.tsx` (hero-visual) | placeholder |
| Geliştirici ifadesi | `src/app/page.tsx` (EKINOX ROLE) | "fikri geliştiren..." |

---

## FOTOĞRAFLARI GÜNCELLEME / YENİ FOTO EKLEME

Fotoğraflar `public/images/` klasöründe. Şu an ekli olanlar:

| Dosya | Nerede görünür |
|---|---|
| `hero-aerial.jpg` | Hero (açılış) görseli |
| `location-aerial.jpg` | Konum bölümü |
| `living-bedroom.jpg` | "Bağımsız yaşam" kartı |
| `support-bathroom.jpg` | "Yanı başında destek" kartı |
| `social-garden.jpg` | "Sosyal bir çevre" kartı |
| `interior-living.jpg` | (yedek — şu an kullanılmıyor) |

**Bir fotoğrafı değiştirmek için:** Aynı isimle yeni dosyayı `public/images/`
klasörüne koy (eskisinin üzerine yaz), push et. Site otomatik güncellenir.

**Yeni foto eklemek için:** Dosyayı `public/images/`'a koy, `src/app/page.tsx`
içinde ilgili `<Image src="/images/DOSYA.jpg" .../>` satırını ekle/düzenle.

**Önemli:** Fotoğrafları web için küçült (genişlik ~1600px, JPG, <500 KB).
Büyük dosyalar siteyi yavaşlatır ve mobil reklam dönüşümünü düşürür.

Tüm görsellerin altında "Konsept görsel — temsilîdir" etiketi vardır;
bu hem marka kuralı hem hukuki gereklilik (var olmayan binayı gerçek
gibi göstermemek). Bu etiketi kaldırma.

---

## SONRAKİ AŞAMA (sistem çalıştıktan sonra)İlk satışlar gelince düşünülecekler:
- Lead scoring eşiklerini gerçek veriye göre kalibre et
- En çok dönüşen reklam açısına bütçe kaydır
- WhatsApp otomatik yanıt / chatbot ekle
- Retargeting kampanyaları kur
- Gerekirse Google Sheets'ten gerçek CRM'e (HubSpot vb.) geç

Bunların hiçbiri şimdi gerekli değil. Önce: satış makinesi çalışıyor mu?
