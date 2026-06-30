import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

// ============================================================
//  TAKİP ID'LERİ — buraya gerçek ID'lerini koy
//  Meta Pixel ID: Meta Events Manager > Veri kaynakları
//  GA4 ID: Google Analytics > Yönetici > Veri akışları (G-XXXXXXX)
// ============================================================
const META_PIXEL_ID = "BURAYA_META_PIXEL_ID";       // örn: 1234567890
const GA4_ID = "BURAYA_GA4_OLCUM_ID";               // örn: G-XXXXXXXXXX

export const metadata: Metadata = {
  title: "Tekirdağ Destekli Yaşam Projesi | Ekinox Türkiye",
  description:
    "Tekirdağ'da kendi tapulu evinizde bağımsız yaşam; ihtiyaç anında destek hizmetleri. Ön bilgilendirme dosyası için başvurun.",
  openGraph: {
    title: "Tekirdağ Destekli Yaşam Projesi | Ekinox Türkiye",
    description:
      "Kendi tapulu evinizde bağımsız yaşam, yanı başında destek. 320 adet 1+1 konut.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasPixel = META_PIXEL_ID && !META_PIXEL_ID.startsWith("BURAYA");
  const hasGA = GA4_ID && !GA4_ID.startsWith("BURAYA");

  return (
    <html lang="tr">
      <head>
        {/* Meta Pixel */}
        {hasPixel && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {/* Google Tag (GA4) */}
        {hasGA && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
