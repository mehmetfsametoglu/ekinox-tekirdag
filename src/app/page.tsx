"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { captureUtm } from "@/lib/utm";
import { track } from "@/lib/tracking";

const WA_NUMBER = "905XXXXXXXXX";
const WA_MESSAGE =
  "Merhaba, Tekirdağ'daki destekli yaşam projesi hakkında bilgi almak istiyorum.";

function waUrl() {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
}

function Tick() {
  return <span className="tick">✓</span>;
}

function ImageNote({ text }: { text?: string }) {
  return <div className="image-note">{text || "Konsept görsel — temsilîdir"}</div>;
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
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin veya WhatsApp'tan yazın.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <a href="#" className="logo-wrap" aria-label="Ekinox Türkiye">
            <Image
              src="/ekinox-logo.png"
              alt="Ekinox Türkiye"
              width={130}
              height={54}
              priority
            />
          </a>

          <a href="#form" className="nav-cta">
            Bilgi Dosyası Al
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">Ekinox Türkiye Sunar</div>

              <h1>
                Geleceğinizi bugün, <em>kendi şartlarınızda</em> planlayın.
              </h1>

              <p className="sub">
                Tekirdağ&apos;da, kendi tapulu evinizde bağımsız yaşamanın
                konforuyla; ihtiyaç duyduğunuzda yanı başınızda destek
                hizmetlerinin bulunduğu yeni nesil bir yaşam modeli.
              </p>

              <div className="actions">
                <a href="#form" className="btn-primary">
                  Ön Bilgilendirme Dosyasını Alın
                </a>
                <a href="#model" className="btn-ghost">
                  Modeli İnceleyin
                </a>
              </div>

              <div className="trustline">
                <div className="ti">
                  <b>320</b>
                  <span>1+1 bağımsız konut</span>
                </div>
                <div className="ti">
                  <b>Tekirdağ</b>
                  <span>doğayla şehir arası</span>
                </div>
                <div className="ti">
                  <b>Tapulu</b>
                  <span>kendi mülkünüz</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="ribbon">Ön Talep Dönemi</div>
              <div className="hero-image-box">
                <Image
                  src="/images/hero-aerial.jpg"
                  alt="Tekirdağ destekli yaşam projesi konsept yerleşim görseli"
                  width={1600}
                  height={914}
                  priority
                  className="hero-image"
                />
                <ImageNote />
              </div>
            </div>
          </div>

          <div className="wrap">
            <div className="hero-wave" />
          </div>
        </section>

        <section className="block">
          <div className="narrow">
            <div className="kicker">Neden Şimdi</div>
            <h2 className="sec">
              Yaşlanmayı kimse planlamak istemez. Ama planlayanlar kazanır.
            </h2>
            <p className="lead">
              Çoğumuz “o günler daha çok uzakta” diye düşünürüz. Oysa kendi
              düzenimizi, kendi evimizi ve bağımsızlığımızı en iyi
              koruyabileceğimiz zaman, o günler gelmeden önceki dönemdir.
            </p>
            <p className="lead">
              Klasik seçenekler çoğu zaman iki uçtan birini sunar: ya tamamen
              kendi başınıza, gerektiğinde desteksiz; ya da bağımsızlığınızı
              tümüyle bırakmanızı isteyen kurumlar.
            </p>
          </div>
        </section>

        <section id="model" className="block warm">
          <div className="wrap">
            <div className="kicker">Model</div>
            <h2 className="sec">
              Kendi eviniz. Yanında bir topluluk. İhtiyaç anında destek.
            </h2>

            <div className="cols feature-cols">
              <article className="feature-card">
                <div className="feature-media">
                  <Image
                    src="/images/living-bedroom.jpg"
                    alt="Yaşlı dostu ergonomik yatak odası konsept görseli"
                    width={900}
                    height={560}
                    className="feature-img"
                  />
                </div>
                <div className="feature-body">
                  <div className="icon">⌂</div>
                  <h3>Bağımsız yaşam</h3>
                  <p>
                    Kendi 1+1 daireniz, kendi kapınız, kendi düzeniniz. Burası
                    bir kurum değil; sizin tapulu eviniz.
                  </p>
                </div>
              </article>

              <article className="feature-card">
                <div className="feature-media">
                  <Image
                    src="/images/support-bathroom.jpg"
                    alt="Acil çağrı ve tutunma barları olan yaşlı dostu banyo"
                    width={900}
                    height={560}
                    className="feature-img"
                  />
                </div>
                <div className="feature-body">
                  <div className="icon">!</div>
                  <h3>Yanı başında destek</h3>
                  <p>
                    Acil çağrı butonu, tutunma barları, kaymaz yüzeyler ve
                    mahremiyet odaklı sensör altyapısıyla desteklenen bir
                    yaşam kurgusu.
                  </p>
                </div>
              </article>

              <article className="feature-card">
                <div className="feature-media">
                  <Image
                    src="/images/social-garden.jpg"
                    alt="Sosyal tesis, havuz, yürüyüş yolları ve peyzaj alanları"
                    width={900}
                    height={560}
                    className="feature-img"
                  />
                </div>
                <div className="feature-body">
                  <div className="icon">◎</div>
                  <h3>Sosyal bir çevre</h3>
                  <p>
                    Ortak yaşam alanları, kafe, restoran, yürüyüş yolları ve
                    bahçe düzeniyle yalnızlaşmadan bağımsız yaşama imkânı.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="block">
          <div className="wrap smart-grid">
            <div>
              <div className="kicker">Akıllı Yaşam Sistemi</div>
              <h2 className="sec">
                Kamera kullanmadan, mahremiyeti koruyan güvenlik altyapısı.
              </h2>
              <p className="lead">
                Daire içinde gösterişli cihaz kalabalığı yerine, günlük yaşamı
                bozmayan sensörler hedeflenir: acil çağrı butonu, kapı
                sensörü, su kaçağı ve duman algılama, hareket/presence sensörü
                ve banyo/yatak odası için radar tabanlı düşme riski algılama.
              </p>

              <div className="smart-list">
                <div><Tick /> Acil çağrı / panik butonu</div>
                <div><Tick /> Duman ve su kaçağı algılama</div>
                <div><Tick /> Kapı ve hareket sensörleri</div>
                <div><Tick /> Gece yönlendirme aydınlatması</div>
                <div><Tick /> Mahremiyet odaklı radar sensörü</div>
                <div><Tick /> Merkezi destek ekibine uyarı altyapısı</div>
              </div>
            </div>

            <div className="smart-visual">
              <Image
                src="/images/interior-living.jpg"
                alt="Akıllı yaşam paneli, SOS butonu ve sensörler bulunan 1+1 salon konsepti"
                width={1200}
                height={760}
                className="smart-image"
              />
              <ImageNote text="Akıllı yaşam sistemi — temsilîdir" />
            </div>
          </div>
        </section>

        <section className="block warm">
          <div className="wrap">
            <div className="kicker">Kimler İçin</div>
            <h2 className="sec">Bu model kimler için düşünüldü?</h2>

            <div className="forlist">
              <div className="fitem">
                <Tick />
                <p>Geleceğini bugünden, sağlıklı ve aktifken planlamak isteyenler.</p>
              </div>
              <div className="fitem">
                <Tick />
                <p>Çocuklarına ya da yakınlarına yük olmadan bağımsızlığını korumak isteyenler.</p>
              </div>
              <div className="fitem">
                <Tick />
                <p>Şehrin yoğunluğundan uzak, ama yalnız kalmadan bir yaşam arayanlar.</p>
              </div>
              <div className="fitem">
                <Tick />
                <p>Uzun vadeli bir gayrimenkul değeri olarak değerlendirmek isteyenler.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="block">
          <div className="wrap">
            <div className="kicker">Proje</div>
            <h2 className="sec">Proje hakkında</h2>

            <div className="facts">
              <div className="fact">
                <div className="k">Konut Tipi</div>
                <div className="v">1+1 bağımsız</div>
              </div>
              <div className="fact">
                <div className="k">Toplam Ünite</div>
                <div className="v">320 adet</div>
              </div>
              <div className="fact">
                <div className="k">Konum</div>
                <div className="v">Tekirdağ</div>
                <small>Sincap Evleri bitişiği</small>
              </div>
              <div className="fact">
                <div className="k">Konsept</div>
                <div className="v">Destekli bağımsız yaşam</div>
              </div>
              <div className="fact">
                <div className="k">Başlangıç Fiyatı</div>
                <div className="v">3.400.000 TL&apos;den</div>
              </div>
              <div className="fact">
                <div className="k">Öngörülen Teslim</div>
                <div className="v">2028 ortası</div>
                <small>~30 ay</small>
              </div>
            </div>
          </div>
        </section>

        <section className="block warm">
          <div className="narrow">
            <div className="kicker">Konum</div>
            <h2 className="sec">Tekirdağ&apos;da, doğayla şehir arasında</h2>
            <p className="lead">
              Sincap Evleri çevresinde, villa dokusu ve yeşil alanlarla çevrili
              bir lokasyon kurgusu. Proje, şehir erişimini korurken daha sakin
              ve sosyal bir yaşam modeli sunmayı hedefler.
            </p>

            <div className="loc-visual">
              <Image
                src="/images/location-aerial.jpg"
                alt="Sincap Evleri çevresi proje konsept lokasyon görseli"
                width={1600}
                height={914}
                className="location-image"
              />
              <ImageNote text="Konsept lokasyon görseli — temsilîdir" />
            </div>
          </div>
        </section>

        <section className="block">
          <div className="narrow">
            <div className="disclaimer">
              <div className="kicker">Şeffaflık</div>
              <h2 className="sec">Ekinox Türkiye&apos;nin bu projedeki rolü</h2>
              <p>
                Bu projenin fikrini geliştiren ve satışını üstlenen taraf
                Ekinox Türkiye&apos;dir. Projenin arsa ve inşaat süreçleri proje
                ortağı tarafından yürütülür; Ekinox Türkiye konseptin
                geliştirilmesinden ve satış organizasyonundan sorumludur.
                Detaylı sözleşme koşulları ön bilgilendirme dosyasında
                paylaşılır.
              </p>
            </div>
          </div>
        </section>

        <section className="block warm">
          <div className="narrow">
            <div className="kicker">Sık Sorulan Sorular</div>
            <h2 className="sec">Aklınıza takılanlar</h2>

            <div className="faq">
              <details>
                <summary>
                  Bu bir huzurevi mi? <span className="plus" />
                </summary>
                <div className="ans">
                  Hayır. Bu, kendi tapulu bağımsız dairenizde yaşadığınız bir
                  konut projesidir. Destek hizmetleri ihtiyaç duyduğunuzda
                  erişiminizdedir; ama yaşam düzeniniz tamamen size aittir.
                </div>
              </details>

              <details>
                <summary>
                  Daireyi satın mı alıyorum, kiralıyor muyum? <span className="plus" />
                </summary>
                <div className="ans">
                  Satın alıyorsunuz. Daire tapunuz doğrudan size devredilir;
                  siz kendi bağımsız konutunuzun tapulu sahibi olursunuz.
                </div>
              </details>

              <details>
                <summary>
                  Hangi hizmetler dahil? <span className="plus" />
                </summary>
                <div className="ans">
                  Öngörülen hizmet modelinde hemşirelik, fizyoterapi, günlük
                  yaşam ve bakım destek hizmetlerinin proje içinde erişilebilir
                  olması planlanmaktadır. Hangi hizmetlerin dahil, hangilerinin
                  talep halinde sunulacağı ön bilgilendirme dosyasında
                  detaylandırılır.
                </div>
              </details>

              <details>
                <summary>
                  Yatırım olarak değerlendirebilir miyim? <span className="plus" />
                </summary>
                <div className="ans">
                  Daire tapulu mülkünüz olduğu için dilediğiniz gibi
                  değerlendirebilirsiniz. Gayrimenkulde gelecekteki değer veya
                  kira getirisi piyasa koşullarına bağlıdır; herhangi bir getiri
                  garantisi verilmez.
                </div>
              </details>
            </div>
          </div>
        </section>

        <section id="form" className="formband">
          <div className="wrap">
            <div className="kicker">Ön Bilgilendirme</div>
            <h2 className="sec">Bilgilendirme dosyasını alın</h2>
            <p className="lead">
              Projenin detaylı tanıtım dosyasını ve fiyat bilgisini size
              ulaştıralım. Bilgileriniz yalnızca bu amaçla kullanılır.
            </p>

            <div className="formcard">
              {!submitted ? (
                <form onSubmit={handleSubmit} onFocus={onFirstInteract}>
                  <div className="field">
                    <label>
                      Ad Soyad <span className="req">*</span>
                    </label>
                    <input name="name" required />
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label>
                        Telefon <span className="req">*</span>
                      </label>
                      <input name="phone" required />
                    </div>
                    <div className="field">
                      <label>E-posta</label>
                      <input name="email" type="email" />
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      Şehir / Ülke <span className="req">*</span>
                    </label>
                    <input name="city" required />
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label>
                        İlgi amacınız <span className="req">*</span>
                      </label>
                      <select name="interest" required defaultValue="">
                        <option value="" disabled>
                          Seçiniz
                        </option>
                        <option>Kendim için</option>
                        <option>Aile büyüğüm için</option>
                        <option>Yatırım amaçlı</option>
                        <option>Sadece bilgi almak istiyorum</option>
                      </select>
                    </div>

                    <div className="field">
                      <label>Bütçe aralığınız</label>
                      <select name="budget" defaultValue="">
                        <option value="" disabled>
                          Seçiniz
                        </option>
                        <option>4 milyon TL üzeri</option>
                        <option>3 – 4 milyon TL</option>
                        <option>Henüz net değil</option>
                      </select>
                    </div>
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label>Ne zaman değerlendiriyorsunuz?</label>
                      <select name="timeline" defaultValue="">
                        <option value="" disabled>
                          Seçiniz
                        </option>
                        <option>1 – 3 ay içinde</option>
                        <option>3 – 6 ay içinde</option>
                        <option>Sadece araştırıyorum</option>
                      </select>
                    </div>

                    <div className="field">
                      <label>Görüşme tercihiniz</label>
                      <select name="contact_pref" defaultValue="WhatsApp">
                        <option>WhatsApp</option>
                        <option>Telefon</option>
                      </select>
                    </div>
                  </div>

                  <label className="consent">
                    <input name="consent" type="checkbox" required />
                    <span>
                      KVKK aydınlatma metnini okudum, benimle iletişim
                      kurulmasını onaylıyorum.
                    </span>
                  </label>

                  {error && <div className="err">{error}</div>}

                  <button className="form-submit" disabled={sending}>
                    {sending ? "Gönderiliyor…" : "Bilgilendirme Dosyasını Gönderin"}
                  </button>

                  <div className="form-note">Bilgileriniz üçüncü taraflarla paylaşılmaz.</div>
                </form>
              ) : (
                <div className="success show">
                  <div className="chk">✓</div>
                  <h3>Talebiniz alındı.</h3>
                  <p>
                    Danışmanlarımız en kısa sürede sizinle iletişime geçecek.
                    Dilerseniz hemen WhatsApp üzerinden de görüşebilirsiniz.
                  </p>
                  <a
                    href={waUrl()}
                    className="wa-btn"
                    onClick={() => track("WhatsAppClick", { from: "success" })}
                    target="_blank"
                  >
                    WhatsApp&apos;tan Görüşün
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="waband">
          <div className="wrap">
            <h2>Hemen görüşmek ister misiniz?</h2>
            <p>Sorularınızı doğrudan satış danışmanımıza iletin.</p>
            <a
              href={waUrl()}
              className="wa-btn"
              onClick={() => track("WhatsAppClick", { from: "band" })}
              target="_blank"
            >
              WhatsApp&apos;tan Danışmanla Görüşün
            </a>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-inner">
            <div className="foot-col">
              <Image src="/ekinox-logo.png" alt="Ekinox Türkiye" width={130} height={54} />
              <p>Ekinox Franchising Geliştirme ve Pazarlama A.Ş.</p>
              <p>Huzur Mah. Azerbaycan Cad. No:4, B Blok, Skyland, Kat:28 Ofis No:408 Sarıyer / İstanbul</p>
              <p>+90 (850) 888 60 48</p>
              <p>info@ekinox.com.tr</p>
            </div>

            <div className="foot-col">
              <a href="https://ekinox.com.tr" target="_blank">
                ekinox.com.tr
              </a>
              <a href="#">KVKK / Gizlilik Politikası</a>
            </div>
          </div>

          <div className="foot-legal">
            Bu sayfada yer alan görseller temsilî olup konsept amaçlıdır.
            Belirtilen hizmetler projenin öngörülen modeline ilişkin olup henüz
            bir taahhüt niteliği taşımaz. Proje detayları, fiyat ve teslim
            koşulları ön bilgilendirme amaçlıdır ve bağlayıcı satış sözleşmesi
            yerine geçmez. Gayrimenkulde getiri garantisi verilmez.
          </div>
        </div>
      </footer>
    </>
  );
}
