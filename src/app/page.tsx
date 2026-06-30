"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { captureUtm } from "@/lib/utm";
import { track } from "@/lib/tracking";

// WhatsApp numarası — gerçek numara ile değiştir (905XXXXXXXXX formatı)
const WA_NUMBER = "905XXXXXXXXX";
const WA_MESSAGE =
  "Merhaba, Tekirdağ'daki destekli yaşam projesi hakkında bilgi almak istiyorum.";

function waUrl() {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
}

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const formStarted = useRef(false);

  useEffect(() => {
    track("PageView");
  }, []);

  function onFirstInteract() {
    if (!formStarted.current) {
      formStarted.current = true;
      track("LeadFormStart");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSending(true);

    const fd = new FormData(e.currentTarget);
    const utm = captureUtm();
    const payload = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      city: String(fd.get("city") || ""),
      interest: String(fd.get("interest") || ""),
      budget: String(fd.get("budget") || ""),
      timeline: String(fd.get("timeline") || ""),
      contactPref: String(fd.get("contact_pref") || ""),
      consent: fd.get("consent") === "on",
      ...utm,
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Gönderim başarısız.");
      }
      track("LeadSubmit", { score: data.score, segment: data.segment });
      if (data.qualified) track("QualifiedLead", { segment: data.segment });
      setSubmitted(true);
      document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin veya WhatsApp'tan yazın.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="wrap nav-inner">
          <Image src="/ekinox-logo.png" alt="Ekinox Türkiye" width={120} height={36} style={{ height: 36, width: "auto" }} priority />
          <a href="#form" className="nav-cta">Bilgi Dosyası Al</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">Ekinox Türkiye Sunar</span>
            <h1>Geleceğinizi bugün, <em>kendi şartlarınızda</em> planlayın.</h1>
            <p className="sub">Tekirdağ&apos;da, kendi tapulu evinizde bağımsız yaşamanın konforuyla; ihtiyaç duyduğunuzda yanı başınızda destek hizmetlerinin bulunduğu yeni nesil bir yaşam modeli.</p>
            <div className="actions">
              <a href="#form" className="btn-primary">Ön Bilgilendirme Dosyasını Alın</a>
              <a href="#model" className="btn-ghost">Modeli İnceleyin</a>
            </div>
            <div className="trustline">
              <div className="ti"><b>320</b><span>1+1 bağımsız konut</span></div>
              <div className="ti"><b>Tekirdağ</b><span>doğayla şehir arası</span></div>
              <div className="ti"><b>Tapulu</b><span>kendi mülkünüz</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="ribbon">Ön Talep Dönemi</div>
            <div className="ph"> <Image
  src="/images/hero-aerial.jpg"
  alt="Tekirdağ destekli yaşam projesi konsept yerleşim görseli"
  width={1600}
  height={1200}
  priority
  className="visual-img"
/>
<div className="ph">Konsept görsel — temsilîdir</div> </div>
          </div>
        </div>
        <div className="wrap"><div className="hero-wave"></div></div>
      </header>

      {/* PROBLEM */}
      <section className="block">
        <div className="narrow">
          <span className="kicker">Neden Şimdi</span>
          <h2 className="sec">Yaşlanmayı kimse planlamak istemez. Ama planlayanlar kazanır.</h2>
          <p className="lead">Çoğumuz &quot;o günler daha çok uzakta&quot; diye düşünürüz. Oysa kendi düzenimizi, kendi evimizi ve bağımsızlığımızı en iyi koruyabileceğimiz zaman, o günler gelmeden önceki dönemdir.</p>
          <p className="lead">Klasik seçenekler çoğu zaman iki uçtan birini sunar: ya tamamen kendi başınıza, gerektiğinde desteksiz; ya da bağımsızlığınızı tümüyle bırakmanızı isteyen kurumlar.</p>
          <p className="lead">Bu projenin çıkış noktası, üçüncü bir yol: <strong>kendi evinizde, kendi düzeninizde yaşamaya devam edin — ama ihtiyacınız olduğunda destek bir kapı ötede olsun.</strong></p>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="block warm" id="model">
        <div className="wrap">
          <span className="kicker">Model</span>
          <h2 className="sec">Kendi eviniz. Yanında bir topluluk. İhtiyaç anında destek.</h2>
          <div className="cols">
            <div className="card">
              <div className="icon"><svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8M5 10v10h14V10"/></svg></div>
              <h3>Bağımsız yaşam</h3>
              <p>Kendi 1+1 daireniz, kendi kapınız, kendi düzeniniz. Burası bir kurum değil; sizin tapulu eviniz.</p>
            </div>
            <div className="card">
              <div className="icon"><svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-7-10a7 7 0 0114 0c0 5.5-7 10-7 10z"/><circle cx="12" cy="11" r="2.4"/></svg></div>
              <h3>Yanı başında destek</h3>
              <p>Hemşirelik, fizyoterapi ve günlük yaşam desteğinin proje içinde erişilebilir olması öngörülüyor. Yalnız değilsiniz, ama özgürlüğünüz de elinizde.</p>
            </div>
            <div className="card">
              <div className="icon"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5M15 20c0-2 1-3.5 3-3.5"/></svg></div>
              <h3>Sosyal bir çevre</h3>
              <p>Ortak yaşam alanları, komşuluk, birlikte vakit geçirebileceğiniz insanlar. Yaşlanmak yalnızlaşmak zorunda değil.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO FOR */}
      <section className="block">
        <div className="narrow">
          <span className="kicker">Kimler İçin</span>
          <h2 className="sec">Bu model kimler için düşünüldü?</h2>
          <div className="forlist">
            <div className="fitem"><div className="mk">✓</div><p>Geleceğini bugünden, sağlıklı ve aktifken planlamak isteyenler</p></div>
            <div className="fitem"><div className="mk">✓</div><p>Çocuklarına ya da yakınlarına yük olmadan, bağımsızlığını korumak isteyenler</p></div>
            <div className="fitem"><div className="mk">✓</div><p>Şehrin yoğunluğundan uzak, ama yalnız kalmadan bir yaşam arayanlar</p></div>
            <div className="fitem"><div className="mk">✓</div><p>Uzun vadeli bir gayrimenkul değeri olarak değerlendirmek isteyenler</p></div>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="block warm">
        <div className="wrap">
          <span className="kicker">Proje</span>
          <h2 className="sec">Proje hakkında</h2>
          <div className="facts">
            <div className="fact"><div className="k">Konut Tipi</div><div className="v">1+1 bağımsız</div></div>
            <div className="fact"><div className="k">Toplam Ünite</div><div className="v">320 adet</div></div>
            <div className="fact"><div className="k">Konum</div><div className="v">Tekirdağ <small>(Sincap Evleri bitişiği)</small></div></div>
            <div className="fact"><div className="k">Konsept</div><div className="v">Destekli bağımsız yaşam</div></div>
            <div className="fact"><div className="k">Başlangıç Fiyatı</div><div className="v">3.400.000 TL<small> &apos;den</small></div></div>
            <div className="fact"><div className="k">Öngörülen Teslim</div><div className="v">2028 ortası <small>(~30 ay)</small></div></div>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="block">
        <div className="narrow">
          <span className="kicker">Konum</span>
          <h2 className="sec">Tekirdağ&apos;da, doğayla şehir arasında</h2>
          <p className="lead">[ Sincap Evleri çevresi, İstanbul&apos;a mesafe, çevredeki sağlık ve sosyal imkanlar bu bölüme yazılacak. ]</p>
          <div className="loc-visual"><div className="ph"> <Image
  src="/images/location-aerial.jpg"
  alt="Tekirdağ Sincap Evleri bitişiği proje konumu konsept görseli"
  width={1600}
  height={700}
  className="visual-img"
/>
<div className="ph">Konsept lokasyon görseli — temsilîdir</div></div> </div>
        </div>
      </section>

      {/* EKINOX ROLE */}
      {/* NOT (Mehmet): Ekinox'un rolü "fikri geliştiren + satışı üstlenen" olarak yazıldı. Canlıya almadan önce Asaf Bey ile teyit et. */}
      <section className="block warm">
        <div className="narrow">
          <span className="kicker">Şeffaflık</span>
          <h2 className="sec">Ekinox Türkiye&apos;nin bu projedeki rolü</h2>
          <div className="disclaimer">
            <p><strong>Bu projenin fikrini geliştiren ve satışını üstlenen taraf Ekinox Türkiye&apos;dir.</strong> Projenin arsa ve inşaat süreçleri proje ortağı tarafından yürütülür; Ekinox Türkiye konseptin geliştirilmesinden ve satış organizasyonundan sorumludur. Detaylı sözleşme koşulları ön bilgilendirme dosyasında paylaşılır.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="block">
        <div className="narrow">
          <span className="kicker">Sık Sorulan Sorular</span>
          <h2 className="sec">Aklınıza takılanlar</h2>
          <div className="faq">
            <details open>
              <summary>Bu bir huzurevi mi?<span className="plus"></span></summary>
              <div className="ans">Hayır. Bu, kendi tapulu bağımsız dairenizde yaşadığınız bir konut projesidir. Destek hizmetleri ihtiyaç duyduğunuzda erişiminizdedir; ama yaşam düzeniniz tamamen size aittir.</div>
            </details>
            <details>
              <summary>Daireyi satın mı alıyorum, kiralıyor muyum?<span className="plus"></span></summary>
              <div className="ans">Satın alıyorsunuz. Daire tapunuz doğrudan size devredilir; siz kendi bağımsız konutunuzun tapulu sahibi olursunuz. Bu bir kiralama veya üyelik modeli değildir.</div>
            </details>
            <details>
              <summary>Hangi hizmetler dahil?<span className="plus"></span></summary>
              <div className="ans">Projenin öngörülen hizmet modelinde hemşirelik, fizyoterapi, günlük yaşam ve bakım destek hizmetlerinin proje içinde erişilebilir olması planlanmaktadır. Hangi hizmetlerin dahil, hangilerinin talep halinde sunulacağı ön bilgilendirme dosyasında detaylandırılır.</div>
            </details>
            <details>
              <summary>Ne zaman teslim edilecek?<span className="plus"></span></summary>
              <div className="ans">Projenin öngörülen teslim tarihi 2028 yılının ortasıdır (yaklaşık 30 ay). Kesin teslim koşulları satış sözleşmesinde belirtilir.</div>
            </details>
            <details>
              <summary>Yatırım olarak değerlendirebilir miyim?<span className="plus"></span></summary>
              <div className="ans">Daire tapulu mülkünüz olduğu için dilediğiniz gibi değerlendirebilirsiniz. Yalnız belirtmek isteriz ki gayrimenkulde gelecekteki değer veya kira getirisi piyasa koşullarına bağlıdır; tarafımızca herhangi bir getiri garantisi verilmez.</div>
            </details>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="formband" id="form">
        <div className="wrap">
          <span className="kicker" style={{ color: "var(--clay-soft)" }}>Ön Bilgilendirme</span>
          <h2 className="sec" style={{ color: "#fff" }}>Bilgilendirme dosyasını alın</h2>
          <p className="lead" style={{ color: "#D9D2CB" }}>Projenin detaylı tanıtım dosyasını ve fiyat bilgisini size ulaştıralım. Bilgileriniz yalnızca bu amaçla kullanılır.</p>
          <div className="formcard">
            {!submitted ? (
              <form onSubmit={handleSubmit} onChange={onFirstInteract}>
                <div className="field-row">
                  <div className="field"><label>Ad Soyad <span className="req">*</span></label><input type="text" name="name" required /></div>
                  <div className="field"><label>Telefon <span className="req">*</span></label><input type="tel" name="phone" required /></div>
                </div>
                <div className="field-row">
                  <div className="field"><label>E-posta</label><input type="email" name="email" /></div>
                  <div className="field"><label>Şehir / Ülke <span className="req">*</span></label><input type="text" name="city" required /></div>
                </div>
                <div className="field">
                  <label>İlgi amacınız <span className="req">*</span></label>
                  <select name="interest" required defaultValue="">
                    <option value="" disabled>Seçiniz</option>
                    <option value="self">Kendim için</option>
                    <option value="family">Aile büyüğüm için</option>
                    <option value="investment">Yatırım amaçlı</option>
                    <option value="info">Sadece bilgi almak istiyorum</option>
                  </select>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Bütçe aralığınız</label>
                    <select name="budget" defaultValue="">
                      <option value="">Seçiniz</option>
                      <option value="4m+">4 milyon TL üzeri</option>
                      <option value="3-4m">3 – 4 milyon TL</option>
                      <option value="unsure">Henüz net değil</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Ne zaman değerlendiriyorsunuz?</label>
                    <select name="timeline" defaultValue="">
                      <option value="">Seçiniz</option>
                      <option value="0-3">1 – 3 ay içinde</option>
                      <option value="3-6">3 – 6 ay içinde</option>
                      <option value="research">Sadece araştırıyorum</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Görüşme tercihiniz</label>
                  <select name="contact_pref" defaultValue="whatsapp">
                    <option value="whatsapp">WhatsApp</option>
                    <option value="phone">Telefon</option>
                  </select>
                </div>
                <label className="consent">
                  <input type="checkbox" name="consent" required />
                  <span>KVKK aydınlatma metnini okudum, benimle iletişim kurulmasını onaylıyorum.</span>
                </label>
                {error && <p style={{ color: "var(--red)", fontSize: 13, marginBottom: 12 }}>{error}</p>}
                <button type="submit" className="form-submit" disabled={sending}>
                  {sending ? "Gönderiliyor…" : "Bilgilendirme Dosyasını Gönderin"}
                </button>
                <p className="form-note">Bilgileriniz üçüncü taraflarla paylaşılmaz.</p>
              </form>
            ) : (
              <div className="success show">
                <div className="chk">✓</div>
                <h3>Talebiniz alındı.</h3>
                <p>Danışmanlarımız en kısa sürede sizinle iletişime geçecek. Dilerseniz hemen WhatsApp üzerinden de görüşebilirsiniz.</p>
                <a href={waUrl()} className="wa-btn" onClick={() => track("WhatsAppClick", { from: "success" })}>
                  <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.4A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1112 20zm4.5-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 01-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a3 3 0 00-1 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.6-.2z"/></svg>
                  WhatsApp&apos;tan Görüşün
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WHATSAPP BAND */}
      <section className="waband">
        <div className="narrow">
          <h2>Hemen görüşmek ister misiniz?</h2>
          <p>Sorularınızı doğrudan satış danışmanımıza iletin.</p>
          <a href={waUrl()} className="wa-btn" style={{ margin: "0 auto" }} onClick={() => track("WhatsAppClick", { from: "band" })}>
            <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.4A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1112 20zm4.5-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 01-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a3 3 0 00-1 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.6-.2z"/></svg>
            WhatsApp&apos;tan Danışmanla Görüşün
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap foot-inner">
          <div className="foot-col">
            <Image src="/ekinox-logo.png" alt="Ekinox Türkiye" width={140} height={44} style={{ height: 44, width: "auto" }} />
            <p>Ekinox Franchising Geliştirme ve Pazarlama A.Ş.</p>
            <p>Huzur Mah. Azerbaycan Cad. No:4, B Blok,<br />Skyland, Kat:28 Ofis No:408 Sarıyer / İstanbul</p>
          </div>
          <div className="foot-col">
            <a href="tel:+908508886048">+90 (850) 888 60 48</a>
            <a href="mailto:info@ekinox.com.tr">info@ekinox.com.tr</a>
            <a href="https://ekinox.com.tr">ekinox.com.tr</a>
            <a href="#">KVKK / Gizlilik Politikası</a>
          </div>
          <div className="foot-brand">EKINOX TÜRKİYE <span className="reddot"></span></div>
        </div>
        <div className="wrap">
          <p className="foot-legal">Bu sayfada yer alan görseller temsilî olup konsept amaçlıdır. Belirtilen hizmetler projenin öngörülen modeline ilişkin olup henüz bir taahhüt niteliği taşımaz. Proje detayları, fiyat ve teslim koşulları ön bilgilendirme amaçlıdır ve bağlayıcı satış sözleşmesi yerine geçmez. Gayrimenkulde getiri garantisi verilmez.</p>
        </div>
      </footer>
    </>
  );
}
