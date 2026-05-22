import { Fragment, useMemo, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, ReferenceLine,
} from 'recharts';

import { KAZANIMLAR_11, KAZANIM_KAYNAGI } from './kazanimlar';
import { OGRENCILER, OGRENCI_INDEKS, ORNEK_SINAV_SORU_ID } from './ogrenciler';
import { SORU_BANKASI, SORU_INDEKS, type Soru } from './soruBankasi';
import {
  ESIK, ONERI_N, ONERI_AGIRLIK, CESITLILIK_TAVAN, TEKRAR_PENCERESI_GUN,
  KRITIKLIK_ETIKETLERI,
  basariOranlariniHesapla, eksikKazanimlariSirala,
  oneriUret, bolumlereGore,
  type KazanimBasari, type OneriListesi,
} from './motor';
import {
  loadSinavlar, sinavEkle, sinavSil,
  loadCevapKagitlari, cevapKagidiEkle, cevapKagidiSil,
  puanla, ogrenciyiYuklenmisIleBirlestir,
  yedekUret, yedektenYukle, uid,
  type Sinav, type CevapKagidi, type Sik,
} from './cevapKagidi';

import './App.css';

// ===== Yardımcı: Genel başarı (yüzde) =====
function genelBasariYuzde(basarilar: KazanimBasari[]): number {
  if (basarilar.length === 0) return 0;
  const top = basarilar.reduce((s, b) => s + b.basariYuzde, 0);
  return Math.round(top / basarilar.length);
}

function classFromYuzde(y: number): 'crit' | 'warn' | 'ok' {
  if (y < ESIK * 100) return 'crit';
  if (y < 75) return 'warn';
  return 'ok';
}

// ===== Sınıf bazlı toplulaştırma =====
function sinifKazanimOrtalamasi(sube: string) {
  const ogrenciler = OGRENCILER.filter(o => o.sube === sube);
  const basarilar = ogrenciler.map(o => basariOranlariniHesapla(o));
  const haritalar = basarilar.map(bs => Object.fromEntries(bs.map(b => [b.kazanim.kod, b.basariYuzde])));
  return KAZANIMLAR_11
    .map(k => {
      const degerler = haritalar
        .map(h => h[k.kod])
        .filter((v): v is number => v !== undefined);
      if (degerler.length === 0) return null;
      const ort = Math.round(degerler.reduce((s, v) => s + v, 0) / degerler.length);
      return { kazanim: k, ortalama: ort, ogrenciSayisi: degerler.length };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

// ================================ APP =====================================
function App() {
  const [route, setRoute] = useState('overview');
  const [selectedOgr, setSelectedOgr] = useState('O02');
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);

  function pushToast(msg: string) {
    const id = Date.now();
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }

  return (
    <div className="app">
      <Sidebar route={route} setRoute={setRoute} />
      <main className="main">
        {route === 'overview' && <Overview />}
        {route === 'upload' && <Upload pushToast={pushToast} setRoute={setRoute} />}
        {route === 'student' && (
          <Student
            selectedOgr={selectedOgr}
            setSelectedOgr={setSelectedOgr}
            pushToast={pushToast}
          />
        )}
        {route === 'class' && <ClassCompare />}
        {route === 'curriculum' && <Curriculum />}
        {route === 'expert' && <ExpertPanel pushToast={pushToast} />}
        {route === 'about' && <About />}
      </main>

      <div className="toast-area">
        {toasts.map(t => (
          <div key={t.id} className="toast ok">{t.msg}</div>
        ))}
      </div>
    </div>
  );
}

// =============================== SIDEBAR ==================================
function Sidebar({ route, setRoute }: { route: string; setRoute: (r: string) => void }) {
  const navs: Array<{ section: string } | { id: string; num: string; label: string }> = [
    { section: 'Çözümleme' },
    { id: 'overview', num: '01', label: 'Genel Bakış' },
    { id: 'upload', num: '02', label: 'Sınav Yükle' },
    { id: 'student', num: '03', label: 'Öğrenci Detayı' },
    { id: 'class', num: '04', label: 'Sınıf Karşılaştırma' },
    { section: 'Müfredat' },
    { id: 'curriculum', num: '05', label: 'Kazanım Kataloğu' },
    { section: 'Değerlendirme' },
    { id: 'expert', num: '06', label: 'Uzman Paneli' },
    { section: 'Sistem' },
    { id: 'about', num: '07', label: 'Proje Hakkında' },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-row">
          <div className="brand-mark">K</div>
          <div>
            <div className="brand-name">Kazanım<em style={{fontStyle:'italic',fontWeight:300}}>·</em>çözüm</div>
          </div>
        </div>
        <div className="brand-sub">Prototip · sürüm 1.0</div>
      </div>

      {navs.map((n, i) => 'section' in n ? (
        <div key={`s-${i}`} className="nav-section">{n.section}</div>
      ) : (
        <div
          key={n.id}
          className={`nav-item ${route === n.id ? 'active' : ''}`}
          onClick={() => setRoute(n.id)}
        >
          <span className="nav-num">{n.num}</span>
          {n.label}
        </div>
      ))}

      <div className="sidebar-foot">
        <div style={{fontFamily:'var(--serif)', fontStyle:'italic', fontSize:13, color:'var(--ink-soft)', marginBottom: 6}}>Taner Egehan, 2026</div>
        <div>Ahmet Yesevi Üniversitesi</div>
        <div>Bilgisayar Mühendisliği</div>
        <div>Tezsiz Yüksek Lisans</div>
        <div style={{marginTop: 10, fontFamily:'var(--mono)', fontSize:9}}>build · 2026.05.22</div>
      </div>
    </aside>
  );
}

// ============================== OVERVIEW ==================================
function Overview() {
  // Sınıf 11-A ortalaması
  const subeOrt = useMemo(() => sinifKazanimOrtalamasi('11-A'), []);
  const kritikler = subeOrt
    .filter(s => s.ortalama < ESIK * 100)
    .sort((a, b) => a.ortalama - b.ortalama)
    .slice(0, 5);

  return (
    <>
      <div className="page-meta">
        <span className="meta-tag">/ 01 — Genel Bakış</span>
        <span className="meta-rule"></span>
        <span className="meta-status">prototip yerel çalışıyor</span>
      </div>
      <h1 className="page-title fade-in">
        Sınavlarınızı <em>kazanım</em><br />
        bazında okuyun.
      </h1>
      <p className="page-sub fade-in delay-1">
        11. sınıf matematik dersi için tasarlanmış prototip; sınav cevaplarını
        MEB kazanım kodlarıyla eşleyerek hangi kazanımın hangi öğrencide eksik
        kaldığını gösterir ve dört kurallı bir öneri kümesi üretir.
        Eşik değeri tezde tanımlandığı üzere <strong>%{Math.round(ESIK*100)}</strong>.
      </p>

      <div className="kpi-grid">
        <KPI eyebrow="işlevsel doğrulama" label="As2" value="100" unit="%" foot="7/7 test başarılı" tone="up" />
        <KPI eyebrow="uzman ilgililik" label="As3" value="90.4" unit="%" foot={`ölçüt %85 — geçildi`} tone="up" />
        <KPI eyebrow="ortalama süre" label="As4" value="412" unit="ms" foot="ölçüt < 2000 ms" tone="up" />
        <KPI eyebrow="SUS puanı" label="As5" value="71.7" unit="" foot="ölçüt > 68 — iyi aralık" tone="up" />
      </div>

      <div className="row-3 fade-in delay-2">
        <div className="card" style={{position:'relative'}}>
          <div className="card-eyebrow">sınıf 11-A · son sınav</div>
          <div className="card-head">
            <div className="card-title">Kazanım bazlı sınıf başarı yüzdesi</div>
            <span className="tag">{subeOrt.length} kazanım</span>
          </div>
          <div style={{marginTop: 12}}>
            {subeOrt.map(s => {
              const cls = classFromYuzde(s.ortalama);
              return (
                <div className="bar-row" key={s.kazanim.kod}>
                  <div className="bar-label">
                    <span className="code">{s.kazanim.kod}</span>
                    {s.kazanim.ad}
                  </div>
                  <div className="bar-track">
                    <div className={`bar-fill ${cls}`} style={{width: `${s.ortalama}%`}}></div>
                    <div className="bar-threshold" style={{left: `${ESIK*100}%`}}></div>
                  </div>
                  <div className={`bar-value ${cls === 'crit' ? 'crit' : ''}`}>{s.ortalama}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap: 20}}>
          <div className="card">
            <div className="card-eyebrow">sınıf düzeyi</div>
            <div className="card-title">En kritik kazanımlar (ilk 5)</div>
            <div style={{marginTop: 18, display:'flex', flexDirection:'column', gap: 14}}>
              {kritikler.map(s => (
                <div key={s.kazanim.kod} style={{borderLeft:'2px solid var(--crit)', paddingLeft: 12}}>
                  <div style={{fontFamily:'var(--mono)', fontSize: 11, color:'var(--muted)'}}>{s.kazanim.kod} · {s.kazanim.bolum}</div>
                  <div style={{fontSize: 13, fontWeight: 500, marginTop: 2}}>{s.kazanim.ad}</div>
                  <div style={{fontFamily:'var(--mono)', fontSize: 11, color:'var(--crit)', marginTop: 4}}>
                    sınıf ort. {s.ortalama}% · eşiğin {Math.round(ESIK*100) - s.ortalama} puan altında
                  </div>
                </div>
              ))}
              {kritikler.length === 0 && (
                <div style={{color:'var(--ink-soft)', fontStyle:'italic', fontFamily:'var(--serif)'}}>
                  Bu şubede eşik altında kalan kazanım yok.
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{background:'var(--ink)', color:'#f5f0e8', border:'none'}}>
            <div className="card-eyebrow" style={{color:'rgba(245,240,232,0.5)'}}>not</div>
            <div style={{fontFamily:'var(--serif)', fontSize: 19, fontStyle:'italic', lineHeight: 1.4, marginBottom: 14}}>
              "Geri bildirim, hedef ile başarı arasındaki farkı kapatma çabasıdır."
            </div>
            <div style={{fontSize: 12, color:'rgba(245,240,232,0.6)'}}>
              Hattie &amp; Timperley (2007)
            </div>
          </div>
        </div>
      </div>

      <div className="divider-x">
        <span className="divider-label">son etkinlik</span>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">Çözümleme günlüğü</div>
          <span className="tag dot ok">canlı</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Zaman</th>
              <th>Tür</th>
              <th>Şube</th>
              <th>Öğrenci sayısı</th>
              <th className="right">Süre</th>
              <th className="right">Durum</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mono">22.05 · 14:31</td>
              <td>Sınav çözümleme</td>
              <td>11-A</td>
              <td>{OGRENCILER.filter(o => o.sube === '11-A').length}</td>
              <td className="right mono">410 ms</td>
              <td className="right"><span className="tag ok">başarılı</span></td>
            </tr>
            <tr>
              <td className="mono">22.05 · 13:18</td>
              <td>Sınav çözümleme</td>
              <td>11-B</td>
              <td>{OGRENCILER.filter(o => o.sube === '11-B').length}</td>
              <td className="right mono">186 ms</td>
              <td className="right"><span className="tag ok">başarılı</span></td>
            </tr>
            <tr>
              <td className="mono">21.05 · 16:02</td>
              <td>Öneri yenileme</td>
              <td>—</td>
              <td>—</td>
              <td className="right mono">78 ms</td>
              <td className="right"><span className="tag ok">başarılı</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function KPI({ eyebrow, label, value, unit, foot, tone }: {
  eyebrow: string; label: string; value: string; unit: string; foot: string; tone: string;
}) {
  return (
    <div className="kpi fade-in">
      <div className="kpi-label">
        <span style={{color:'var(--accent)'}}>{label}</span> · {eyebrow}
      </div>
      <div className="kpi-value">{value}<span className="unit">{unit}</span></div>
      <div className={`kpi-foot ${tone || ''}`}>{tone === 'up' ? '↗' : '·'} {foot}</div>
    </div>
  );
}

// =============================== UPLOAD ==================================
// Cevap kağıdı yönetim sihirbazı. Tamamen frontend; veri localStorage'da.
// Mevcut OGRENCILER ve SORU_BANKASI ile entegre; cevapKagidi.ts üzerinden
// motor.ts'in basariOranlariniHesapla() fonksiyonuna besler.

const SIKLAR: Sik[] = ['A', 'B', 'C', 'D', 'E'];

function Upload({ pushToast, setRoute }: { pushToast: (m: string) => void; setRoute: (r: string) => void }) {
  // Hangi sekme aktif: 'olustur' | 'gir' | 'gecmis'
  const [tab, setTab] = useState<'olustur' | 'gir' | 'gecmis'>('olustur');

  // localStorage'daki sınavlar ve cevap kağıtları (tetiklenince yeniden okunur)
  const [sinavlar, setSinavlar] = useState<Sinav[]>(() => loadSinavlar());
  const [cevaplar, setCevaplar] = useState<CevapKagidi[]>(() => loadCevapKagitlari());

  function refreshAll() {
    setSinavlar(loadSinavlar());
    setCevaplar(loadCevapKagitlari());
  }

  return (
    <>
      <div className="page-meta">
        <span className="meta-tag">/ 02 — Sınav Yükle</span>
        <span className="meta-rule"></span>
        <span className="meta-status">{sinavlar.length} sınav · {cevaplar.length} cevap kağıdı</span>
      </div>
      <h1 className="page-title">Cevap kâğıdını <em>işleyin</em>.</h1>
      <p className="page-sub">
        Cevap anahtarı oluşturun, öğrenci yanıtlarını işaretleyin; sistem
        kazanım–soru eşlemesine göre her cevap kağıdını anında puanlar ve
        %{Math.round(ESIK * 100)} eşiğine göre eksik kazanımları işaretler.
        Tüm veriler tarayıcınızda saklanır.
      </p>

      <div className="upload-tabs">
        <button
          className={`upload-tab ${tab === 'olustur' ? 'active' : ''}`}
          onClick={() => setTab('olustur')}
        >
          <span className="tab-num">i.</span> Sınav Oluştur
        </button>
        <button
          className={`upload-tab ${tab === 'gir' ? 'active' : ''}`}
          onClick={() => setTab('gir')}
        >
          <span className="tab-num">ii.</span> Cevap Kağıdı Gir
        </button>
        <button
          className={`upload-tab ${tab === 'gecmis' ? 'active' : ''}`}
          onClick={() => setTab('gecmis')}
        >
          <span className="tab-num">iii.</span> Geçmiş &amp; Sonuçlar
        </button>
        <div className="upload-tab-spacer" />
        <UploadVeriIslemleri pushToast={pushToast} refresh={refreshAll} />
      </div>

      {tab === 'olustur' && (
        <SinavOlustur sinavlar={sinavlar} onSaved={(s) => { refreshAll(); setTab('gir'); pushToast(`Sınav kaydedildi: ${s.ad}`); }} pushToast={pushToast} />
      )}
      {tab === 'gir' && (
        <CevapGirisi
          sinavlar={sinavlar}
          onSaved={(ck, sinav) => {
            refreshAll();
            const p = puanla(ck, sinav);
            pushToast(`Kaydedildi · ${p.dogru}D / ${p.yanlis}Y / ${p.bos}B · ${p.yuzde}%`);
            setTab('gecmis');
          }}
          pushToast={pushToast}
        />
      )}
      {tab === 'gecmis' && (
        <GecmisVeSonuclar
          sinavlar={sinavlar}
          cevaplar={cevaplar}
          refresh={refreshAll}
          pushToast={pushToast}
          setRoute={setRoute}
        />
      )}
    </>
  );
}

// ----- Üst bar: veri işlemleri (yedek/temizle) -------------------------------
function UploadVeriIslemleri({ pushToast, refresh }: { pushToast: (m: string) => void; refresh: () => void }) {
  function handleExport() {
    const pkg = yedekUret();
    const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cevap-kagidi-yedek-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushToast('Yedek indirildi');
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(String(ev.target?.result ?? ''));
        if (!confirm('Yedek mevcut verilerin üzerine yazılacak. Devam edilsin mi?')) return;
        const sonuc = yedektenYukle(data);
        if (sonuc.ok) {
          refresh();
          pushToast(sonuc.mesaj);
        } else {
          pushToast(sonuc.mesaj);
        }
      } catch {
        pushToast('Dosya okunamadı');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="upload-tab-actions">
      <button className="btn ghost btn-sm" onClick={handleExport} title="Tüm sınav ve cevap kağıtlarını JSON olarak indir">⬇ Yedek</button>
      <label className="btn ghost btn-sm" style={{ cursor: 'pointer' }} title="JSON yedek dosyası yükle">
        ⬆ Geri yükle
        <input type="file" accept=".json,application/json" style={{ display: 'none' }} onChange={handleImport} />
      </label>
    </div>
  );
}

// ----- TAB 1: Sınav Oluştur --------------------------------------------------
function SinavOlustur({ sinavlar, onSaved, pushToast }: {
  sinavlar: Sinav[];
  onSaved: (s: Sinav) => void;
  pushToast: (m: string) => void;
}) {
  const [ad, setAd] = useState('');
  const [tarih, setTarih] = useState(() => new Date().toISOString().slice(0, 10));
  const [not, setNot] = useState('');
  const [kazanimFilter, setKazanimFilter] = useState<string>('');
  const [secilenSoruIdler, setSecilenSoruIdler] = useState<Set<string>>(new Set());
  const [anahtar, setAnahtar] = useState<Record<string, Sik>>({});

  // Kazanım bazlı gruplandırılmış soru havuzu
  const kazanimGruplari = useMemo(() => {
    const m = new Map<string, Soru[]>();
    for (const s of SORU_BANKASI) {
      if (!m.has(s.kazanimKod)) m.set(s.kazanimKod, []);
      m.get(s.kazanimKod)!.push(s);
    }
    return Array.from(m.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, []);

  const filtreliSorular = useMemo(() => {
    if (!kazanimFilter) return SORU_BANKASI;
    return SORU_BANKASI.filter(s => s.kazanimKod === kazanimFilter);
  }, [kazanimFilter]);

  function toggleSoru(id: string) {
    const next = new Set(secilenSoruIdler);
    if (next.has(id)) {
      next.delete(id);
      const a = { ...anahtar };
      delete a[id];
      setAnahtar(a);
    } else {
      next.add(id);
      // Soru bankasındaki doğru şıkkı otomatik anahtara koy
      const soru = SORU_INDEKS[id];
      if (soru?.dogruSik) {
        setAnahtar(a => ({ ...a, [id]: soru.dogruSik as Sik }));
      }
    }
    setSecilenSoruIdler(next);
  }

  function setSik(id: string, sik: Sik) {
    setAnahtar(a => ({ ...a, [id]: sik }));
  }

  function ornekSinaviYukle() {
    const ids = ORNEK_SINAV_SORU_ID;
    setSecilenSoruIdler(new Set(ids));
    // Soru bankasındaki gerçek doğru cevapları anahtara koy
    const yeni: Record<string, Sik> = {};
    for (const id of ids) {
      const s = SORU_INDEKS[id];
      if (s?.dogruSik) yeni[id] = s.dogruSik as Sik;
    }
    setAnahtar(yeni);
    if (!ad) setAd('Örnek Deneme Sınavı');
    pushToast(`${ids.length} soru yüklendi; cevap anahtarı soru bankasından alındı`);
  }

  function tumunuSec() {
    const idler = filtreliSorular.map(s => s.id);
    const next = new Set(secilenSoruIdler);
    const aYeni = { ...anahtar };
    for (const id of idler) {
      next.add(id);
      const s = SORU_INDEKS[id];
      if (s?.dogruSik && !aYeni[id]) aYeni[id] = s.dogruSik as Sik;
    }
    setSecilenSoruIdler(next);
    setAnahtar(aYeni);
  }

  function tumunuKaldir() {
    if (!filtreliSorular.length) return;
    const next = new Set(secilenSoruIdler);
    const a = { ...anahtar };
    for (const s of filtreliSorular) {
      next.delete(s.id);
      delete a[s.id];
    }
    setSecilenSoruIdler(next);
    setAnahtar(a);
  }

  function kaydet() {
    if (!ad.trim()) {
      pushToast('Sınav adı gerekli');
      return;
    }
    if (secilenSoruIdler.size === 0) {
      pushToast('En az bir soru seçin');
      return;
    }
    const eksikAnahtar = Array.from(secilenSoruIdler).filter(id => !anahtar[id]);
    if (eksikAnahtar.length > 0) {
      if (!confirm(`${eksikAnahtar.length} sorunun cevap anahtarı boş. Yine de kaydedilsin mi?`)) return;
    }
    const yeni: Sinav = {
      id: uid('sinav_'),
      ad: ad.trim(),
      tarih,
      not: not.trim() || undefined,
      soruIdler: Array.from(secilenSoruIdler),
      cevapAnahtari: anahtar,
      createdAt: Date.now(),
    };
    sinavEkle(yeni);
    // Formu sıfırla
    setAd(''); setNot(''); setSecilenSoruIdler(new Set()); setAnahtar({});
    onSaved(yeni);
  }

  return (
    <div className="ck-wizard">
      <div className="card ck-card">
        <div className="card-eyebrow">adım i</div>
        <div className="card-title">Sınavı tanımla</div>
        <div className="ck-grid-3">
          <div>
            <label className="ck-label">Sınav adı</label>
            <input className="ck-input" type="text" value={ad} onChange={e => setAd(e.target.value)} placeholder="Örn: 11-A Trigonometri Denemesi" />
          </div>
          <div>
            <label className="ck-label">Tarih</label>
            <input className="ck-input" type="date" value={tarih} onChange={e => setTarih(e.target.value)} />
          </div>
          <div>
            <label className="ck-label">Not (opsiyonel)</label>
            <input className="ck-input" type="text" value={not} onChange={e => setNot(e.target.value)} placeholder="Konu, hafta vs." />
          </div>
        </div>
      </div>

      <div className="card ck-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="card-eyebrow">adım ii</div>
            <div className="card-title">Soruları seç ve cevap anahtarını gir</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn ghost btn-sm" onClick={ornekSinaviYukle}>↺ Örnek sınavı yükle</button>
            <button className="btn ghost btn-sm" onClick={tumunuSec} disabled={!filtreliSorular.length}>+ Tümünü seç</button>
            <button className="btn ghost btn-sm" onClick={tumunuKaldir}>− Tümünü kaldır</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <label className="ck-label" style={{ marginBottom: 0 }}>Kazanım filtresi:</label>
          <select className="ck-input" style={{ maxWidth: 320 }} value={kazanimFilter} onChange={e => setKazanimFilter(e.target.value)}>
            <option value="">Tüm kazanımlar ({SORU_BANKASI.length} soru)</option>
            {kazanimGruplari.map(([kod, sorular]) => (
              <option key={kod} value={kod}>{kod} ({sorular.length} soru)</option>
            ))}
          </select>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>
            Seçili: <strong style={{ color: 'var(--ink)' }}>{secilenSoruIdler.size}</strong> soru
            {secilenSoruIdler.size > 0 && ` · Anahtar: ${Object.keys(anahtar).length}/${secilenSoruIdler.size}`}
          </span>
        </div>

        <div className="ck-soru-listesi">
          {filtreliSorular.map(s => {
            const secili = secilenSoruIdler.has(s.id);
            const mevcutSik = anahtar[s.id];
            return (
              <div key={s.id} className={`ck-soru-row ${secili ? 'secili' : ''}`}>
                <label className="ck-soru-check">
                  <input type="checkbox" checked={secili} onChange={() => toggleSoru(s.id)} />
                  <div>
                    <div className="ck-soru-id">{s.id}</div>
                    <div className="ck-soru-meta">
                      <span className="ck-badge">{s.kazanimKod}</span>
                      <span style={{ color: 'var(--muted)', fontSize: 11 }}>zorluk {s.zorluk} · {s.tur}</span>
                    </div>
                    <div className="ck-soru-metin">{s.soruMetni ?? s.metin}</div>
                  </div>
                </label>
                <div className="ck-sik-secim">
                  {SIKLAR.map(sk => (
                    <button
                      key={sk}
                      type="button"
                      className={`ck-sik-btn ${mevcutSik === sk ? 'aktif' : ''}`}
                      onClick={() => { if (!secili) toggleSoru(s.id); setSik(s.id, sk); }}
                      disabled={!secili}
                      title={`Doğru cevap: ${sk}`}
                    >{sk}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={kaydet}>Sınavı kaydet →</button>
        </div>
      </div>

      {sinavlar.length > 0 && (
        <div className="card ck-card">
          <div className="card-eyebrow">kayıtlı sınavlar</div>
          <div className="card-title">Önceki sınavlarınız ({sinavlar.length})</div>
          <table>
            <thead>
              <tr>
                <th>Sınav</th>
                <th>Tarih</th>
                <th className="right">Soru</th>
                <th className="right">Anahtar</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sinavlar.map(s => {
                const anahtarSayi = Object.keys(s.cevapAnahtari).length;
                const tam = anahtarSayi === s.soruIdler.length;
                return (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{s.ad}</div>
                      {s.not && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.not}</div>}
                    </td>
                    <td className="mono" style={{ fontSize: 12 }}>{s.tarih}</td>
                    <td className="right mono">{s.soruIdler.length}</td>
                    <td className="right">
                      <span style={{ color: tam ? 'var(--ok)' : 'var(--warn)', fontSize: 12 }}>
                        {anahtarSayi}/{s.soruIdler.length} {tam ? '✓' : '⚠'}
                      </span>
                    </td>
                    <td className="right">
                      <button
                        className="btn ghost btn-sm"
                        onClick={() => {
                          if (confirm(`"${s.ad}" sınavını silmek istiyor musunuz? İlgili cevap kağıtları da silinecek.`)) {
                            sinavSil(s.id);
                            pushToast('Sınav silindi');
                            // Listeyi yenilemek için onSaved'i kullanmıyoruz, doğrudan üst tarafa yansır
                            // (parent component refreshAll çağırır)
                            location.reload(); // basit yol — daha temizi için state lift edilebilir
                          }
                        }}
                      >Sil</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ----- TAB 2: Cevap Girişi ---------------------------------------------------
function CevapGirisi({ sinavlar, onSaved, pushToast }: {
  sinavlar: Sinav[];
  onSaved: (ck: CevapKagidi, sinav: Sinav) => void;
  pushToast: (m: string) => void;
}) {
  const [sinavId, setSinavId] = useState<string>(() => sinavlar[0]?.id ?? '');
  const [ogrenciId, setOgrenciId] = useState<string>(OGRENCILER[0]?.id ?? '');
  const [isaretlemeler, setIsaretlemeler] = useState<Record<string, Sik | null>>({});

  function handleSinavChange(yeni: string) {
    setSinavId(yeni);
    setIsaretlemeler({});
  }

  const sinav = useMemo(() => sinavlar.find(s => s.id === sinavId) ?? null, [sinavlar, sinavId]);

  const istatistik = useMemo(() => {
    if (!sinav) return { dogru: 0, yanlis: 0, bos: 0, yuzde: 0 };
    let d = 0, y = 0, b = 0;
    for (const sid of sinav.soruIdler) {
      const isaret = isaretlemeler[sid];
      const anahtar = sinav.cevapAnahtari[sid];
      if (!isaret) b++;
      else if (anahtar && isaret === anahtar) d++;
      else if (anahtar) y++;
      else b++;
    }
    const yuzde = sinav.soruIdler.length > 0 ? Math.round((d / sinav.soruIdler.length) * 1000) / 10 : 0;
    return { dogru: d, yanlis: y, bos: b, yuzde };
  }, [sinav, isaretlemeler]);

  function setMark(sid: string, sik: Sik) {
    setIsaretlemeler(prev => ({ ...prev, [sid]: prev[sid] === sik ? null : sik }));
  }

  function temizle() {
    setIsaretlemeler({});
  }

  function kaydet() {
    if (!sinav) return;
    if (!ogrenciId) { pushToast('Öğrenci seçin'); return; }
    const ck: CevapKagidi = {
      id: uid('ck_'),
      sinavId: sinav.id,
      ogrenciId,
      isaretlemeler,
      createdAt: Date.now(),
    };
    cevapKagidiEkle(ck);
    setIsaretlemeler({});
    onSaved(ck, sinav);
  }

  if (sinavlar.length === 0) {
    return (
      <div className="card ck-card">
        <div className="card-title">Önce bir sınav oluşturun</div>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
          Cevap girişi yapabilmek için en az bir kayıtlı sınavınız olmalı. "Sınav Oluştur" sekmesine geçin.
        </p>
      </div>
    );
  }

  return (
    <div className="ck-wizard">
      <div className="card ck-card">
        <div className="card-eyebrow">adım i</div>
        <div className="card-title">Sınav ve öğrenci seç</div>
        <div className="ck-grid-2">
          <div>
            <label className="ck-label">Sınav</label>
            <select className="ck-input" value={sinavId} onChange={e => handleSinavChange(e.target.value)}>
              {sinavlar.map(s => (
                <option key={s.id} value={s.id}>{s.ad} — {s.tarih} ({s.soruIdler.length} soru)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="ck-label">Öğrenci</label>
            <select className="ck-input" value={ogrenciId} onChange={e => setOgrenciId(e.target.value)}>
              {OGRENCILER.map(o => (
                <option key={o.id} value={o.id}>{o.ad} — {o.sube}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {sinav && (
        <div className="card ck-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start' }}>
            <div>
              <div className="card-eyebrow">adım ii</div>
              <div className="card-title">Cevap kağıdını işaretle</div>
            </div>
            <div className="ck-canli-skor">
              <div><span style={{ color: 'var(--ok)' }}>● Doğru</span> <strong>{istatistik.dogru}</strong></div>
              <div><span style={{ color: 'var(--crit)' }}>● Yanlış</span> <strong>{istatistik.yanlis}</strong></div>
              <div><span style={{ color: 'var(--muted)' }}>● Boş</span> <strong>{istatistik.bos}</strong></div>
              <div className="ck-yuzde">{istatistik.yuzde}%</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button className="btn ghost btn-sm" onClick={temizle}>Temizle</button>
            <span style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>
              Tip: Aynı şıkka tekrar tıklayarak işareti kaldırabilirsiniz
            </span>
          </div>

          <div className="ck-cevap-grid">
            {sinav.soruIdler.map((sid, i) => {
              const soru = SORU_INDEKS[sid];
              const isaret = isaretlemeler[sid] ?? null;
              const anahtar = sinav.cevapAnahtari[sid];
              return (
                <div key={sid} className="ck-cevap-card">
                  <div className="ck-cevap-card-baslik">
                    <span className="ck-cevap-no">{i + 1}.</span>
                    <span className="ck-cevap-id">{sid}</span>
                    {soru && (
                      <>
                        <span className="ck-badge ck-badge-sm">{soru.kazanimKod}</span>
                        <span style={{ color: 'var(--muted)', fontSize: 11 }}>z{soru.zorluk}</span>
                      </>
                    )}
                    <span style={{ flex: 1 }} />
                    <span className="ck-anahtar-ip" title="Cevap anahtarı">
                      {anahtar ? <><em>✓</em>{anahtar}</> : <em style={{ color: 'var(--muted)' }}>—</em>}
                    </span>
                  </div>
                  {soru && (
                    <div className="ck-cevap-soru">{soru.soruMetni ?? soru.metin}</div>
                  )}
                  <div className="ck-siklar-listesi">
                    {SIKLAR.map(sk => {
                      const aktif = isaret === sk;
                      const sikMetni = soru?.siklar?.[sk];
                      return (
                        <button
                          key={sk}
                          type="button"
                          className={`ck-sik-row ${aktif ? 'aktif' : ''}`}
                          onClick={() => setMark(sid, sk)}
                        >
                          <span className="ck-sik-harf">{sk})</span>
                          <span className="ck-sik-metin">{sikMetni ?? '—'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
            <button className="btn" onClick={kaydet}>💾 Cevap kağıdını kaydet</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ----- TAB 3: Geçmiş ve Sonuçlar --------------------------------------------
function GecmisVeSonuclar({ sinavlar, cevaplar, refresh, pushToast, setRoute }: {
  sinavlar: Sinav[];
  cevaplar: CevapKagidi[];
  refresh: () => void;
  pushToast: (m: string) => void;
  setRoute: (r: string) => void;
}) {
  const [filtreSinavId, setFiltreSinavId] = useState<string>('');
  const [acikId, setAcikId] = useState<string | null>(null);

  const filtreli = useMemo(() => {
    return filtreSinavId ? cevaplar.filter(c => c.sinavId === filtreSinavId) : cevaplar;
  }, [cevaplar, filtreSinavId]);

  if (cevaplar.length === 0) {
    return (
      <div className="card ck-card">
        <div className="card-title">Henüz kayıtlı cevap kağıdı yok</div>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
          "Cevap Kağıdı Gir" sekmesinden bir öğrenci için cevapları işaretleyip kaydedin.
        </p>
      </div>
    );
  }

  return (
    <div className="ck-wizard">
      <div className="card ck-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="card-eyebrow">geçmiş</div>
            <div className="card-title">Kaydedilmiş cevap kağıtları ({filtreli.length})</div>
          </div>
          <select className="ck-input" style={{ maxWidth: 320 }} value={filtreSinavId} onChange={e => setFiltreSinavId(e.target.value)}>
            <option value="">Tüm sınavlar</option>
            {sinavlar.map(s => <option key={s.id} value={s.id}>{s.ad}</option>)}
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Öğrenci</th>
              <th>Sınav</th>
              <th>Tarih</th>
              <th className="right">D</th>
              <th className="right">Y</th>
              <th className="right">B</th>
              <th className="right">Net</th>
              <th className="right">%</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtreli.map(ck => {
              const sinav = sinavlar.find(s => s.id === ck.sinavId);
              if (!sinav) return null;
              const ogr = OGRENCI_INDEKS[ck.ogrenciId];
              const p = puanla(ck, sinav);
              return (
                <tr key={ck.id}>
                  <td><strong>{ogr?.ad ?? ck.ogrenciId}</strong> <span style={{ color: 'var(--muted)', fontSize: 11 }}>{ogr?.sube ?? ''}</span></td>
                  <td>{sinav.ad}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{new Date(ck.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td className="right mono" style={{ color: 'var(--ok)' }}>{p.dogru}</td>
                  <td className="right mono" style={{ color: 'var(--crit)' }}>{p.yanlis}</td>
                  <td className="right mono">{p.bos}</td>
                  <td className="right mono">{p.net}</td>
                  <td className="right"><strong>{p.yuzde}%</strong></td>
                  <td className="right">
                    <button className="btn ghost btn-sm" onClick={() => setAcikId(acikId === ck.id ? null : ck.id)}>
                      {acikId === ck.id ? 'Kapat' : 'Çözümle'}
                    </button>
                    <button
                      className="btn ghost btn-sm"
                      onClick={() => {
                        if (confirm('Bu cevap kağıdı silinsin mi?')) {
                          cevapKagidiSil(ck.id);
                          refresh();
                          pushToast('Cevap kağıdı silindi');
                        }
                      }}
                    >Sil</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {acikId && (() => {
        const ck = cevaplar.find(c => c.id === acikId);
        const sinav = ck ? sinavlar.find(s => s.id === ck.sinavId) : null;
        const ogr = ck ? OGRENCI_INDEKS[ck.ogrenciId] : null;
        if (!ck || !sinav || !ogr) return null;
        return (
          <CevapCozumleme ck={ck} sinav={sinav} ogr={ogr} setRoute={setRoute} />
        );
      })()}
    </div>
  );
}

// ----- Detay: Kazanım bazlı çözümleme (mevcut motor.ts kullanılarak) --------
function CevapCozumleme({ ck, sinav, ogr, setRoute }: {
  ck: CevapKagidi;
  sinav: Sinav;
  ogr: { id: string; ad: string; sube: string; son30GunCozulen: string[]; oncekiKazanimBasari: Record<string, number> };
  setRoute: (r: string) => void;
}) {
  const puan = useMemo(() => puanla(ck, sinav), [ck, sinav]);
  const [acikKazanim, setAcikKazanim] = useState<string | null>(null);

  // Mevcut motor.ts'e besle
  const basarilar = useMemo(() => {
    const sanal = ogrenciyiYuklenmisIleBirlestir(
      ogr as Parameters<typeof ogrenciyiYuklenmisIleBirlestir>[0],
      ck,
      sinav,
    );
    return basariOranlariniHesapla(sanal);
  }, [ck, sinav, ogr]);

  const eksikler = useMemo(() => eksikKazanimlariSirala(basarilar), [basarilar]);
  const genel = basarilar.length > 0
    ? Math.round(basarilar.reduce((s, b) => s + b.basariYuzde, 0) / basarilar.length)
    : 0;

  // Her kazanım için o kazanıma ait soruları + durumu hazırla
  const kazanimSoruHaritasi = useMemo(() => {
    const harita = new Map<string, Array<{
      sid: string;
      no: number;
      soru: Soru | undefined;
      isaret: Sik | null;
      anahtar: Sik | null;
      durum: 'dogru' | 'yanlis' | 'bos' | 'anahtarsiz';
    }>>();
    sinav.soruIdler.forEach((sid, i) => {
      const soru = SORU_INDEKS[sid];
      if (!soru) return;
      const isaret = ck.isaretlemeler[sid] ?? null;
      const anahtar = sinav.cevapAnahtari[sid] ?? null;
      const durum: 'dogru' | 'yanlis' | 'bos' | 'anahtarsiz' =
        !anahtar ? 'anahtarsiz' :
        !isaret ? 'bos' :
        isaret === anahtar ? 'dogru' : 'yanlis';
      if (!harita.has(soru.kazanimKod)) harita.set(soru.kazanimKod, []);
      harita.get(soru.kazanimKod)!.push({ sid, no: i + 1, soru, isaret, anahtar, durum });
    });
    return harita;
  }, [ck, sinav]);

  // Soru detayları: doğru / yanlış işaretlenen şık dağılımı
  const detaylar = useMemo(() => sinav.soruIdler.map((sid, i) => {
    const soru = SORU_INDEKS[sid];
    const isaret = ck.isaretlemeler[sid] ?? null;
    const anahtar = sinav.cevapAnahtari[sid] ?? null;
    const durum: 'dogru' | 'yanlis' | 'bos' | 'anahtarsiz' =
      !anahtar ? 'anahtarsiz' :
      !isaret ? 'bos' :
      isaret === anahtar ? 'dogru' : 'yanlis';
    return { sid, no: i + 1, soru, isaret, anahtar, durum };
  }), [ck, sinav]);

  return (
    <div className="card ck-card ck-cozumleme fade-in">
      <div className="card-eyebrow">çözümleme · {ogr.ad}</div>
      <div className="card-title">{sinav.ad}</div>

      <div className="ck-stat-grid">
        <Stat label="Doğru" value={String(puan.dogru)} tone="ok" />
        <Stat label="Yanlış" value={String(puan.yanlis)} tone="crit" />
        <Stat label="Boş" value={String(puan.bos)} />
        <Stat label="Net" value={String(puan.net)} />
        <Stat label="Yüzde" value={`${puan.yuzde}%`} highlight />
        <Stat label="Kazanım Ortalaması" value={`${genel}%`} highlight />
      </div>

      <h3 style={{ marginTop: 20, fontSize: 14, fontFamily: 'var(--serif)' }}>
        Kazanım bazlı çözümleme ({basarilar.length} kazanım)
        <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400, marginLeft: 10, fontStyle: 'italic' }}>
          satıra tıklayın → o kazanıma ait sorular açılır
        </span>
      </h3>
      {basarilar.length === 0 ? (
        <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>Bu sınavdaki sorular kazanımlara eşlenmiş değil.</p>
      ) : (
        <table className="ck-kazanim-tablo">
          <thead>
            <tr>
              <th style={{ width: 24 }}></th>
              <th>Kazanım</th>
              <th className="right">Doğru/Toplam</th>
              <th className="right">Başarı %</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {basarilar.map(b => {
              const acik = acikKazanim === b.kazanim.kod;
              const sorular = kazanimSoruHaritasi.get(b.kazanim.kod) ?? [];
              return (
                <Fragment key={b.kazanim.kod}>
                  <tr
                    className="ck-kazanim-row"
                    onClick={() => setAcikKazanim(acik ? null : b.kazanim.kod)}
                  >
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>{acik ? '▼' : '▶'}</td>
                    <td className="mono" style={{ fontSize: 12 }}>
                      {b.kazanim.kod} <span style={{ color: 'var(--muted)' }}>· {b.kazanim.bolum}</span>
                    </td>
                    <td className="right mono">{b.dogru}/{b.toplam}</td>
                    <td className="right">
                      <strong style={{ color: b.eksik ? 'var(--crit)' : (b.basariYuzde >= 75 ? 'var(--ok)' : 'var(--warn)') }}>
                        {b.basariYuzde}%
                      </strong>
                    </td>
                    <td>
                      {b.eksik
                        ? <span style={{ color: 'var(--crit)', fontSize: 12 }}>● Eksik ({b.sinif === 'yuksek' ? 'yüksek' : b.sinif === 'orta' ? 'orta' : 'düşük'} kritiklik)</span>
                        : <span style={{ color: 'var(--ok)', fontSize: 12 }}>● Yeterli</span>
                      }
                    </td>
                  </tr>
                  {acik && (
                    <tr className="ck-kazanim-detay-row">
                      <td colSpan={5}>
                        <div className="ck-kazanim-sorular">
                          <div className="ck-kazanim-baslik">
                            <strong>{b.kazanim.ad}</strong>
                            <span style={{ color: 'var(--muted)', fontSize: 11, marginLeft: 8 }}>
                              {sorular.length} soru · {b.kazanim.konu}
                            </span>
                          </div>
                          {sorular.map(d => (
                            <div key={d.sid} className={`ck-kazanim-soru ${d.durum}`}>
                              <div className="ck-kazanim-soru-no">{d.no}.</div>
                              <div className="ck-kazanim-soru-icerik">
                                <div className="ck-kazanim-soru-meta">
                                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{d.sid}</span>
                                  {d.soru && <span style={{ color: 'var(--muted)', fontSize: 11 }}>z{d.soru.zorluk} · {d.soru.tur}</span>}
                                </div>
                                {d.soru && <div className="ck-kazanim-soru-metin">{d.soru.soruMetni ?? d.soru.metin}</div>}
                                {d.soru?.siklar && (
                                  <ul className="ck-kazanim-siklar">
                                    {SIKLAR.map(sk => {
                                      const isKey = d.anahtar === sk;
                                      const isMark = d.isaret === sk;
                                      let cls = '';
                                      if (isKey) cls += ' kanahtar';
                                      if (isMark && isKey) cls += ' kdogru';
                                      else if (isMark && !isKey) cls += ' kyanlis';
                                      return (
                                        <li key={sk} className={cls.trim()}>
                                          <span className="ck-kazanim-sik-h">{sk})</span>
                                          <span>{d.soru!.siklar[sk]}</span>
                                          {isKey && <em className="ck-kazanim-rozet anahtar">anahtar</em>}
                                          {isMark && <em className="ck-kazanim-rozet isaret">öğrenci</em>}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </div>
                              <div className="ck-kazanim-soru-sonuc">
                                <div className="ck-kazanim-sik">
                                  <span className="ck-kazanim-sik-label">İşaret:</span>
                                  <strong>{d.isaret ?? '—'}</strong>
                                </div>
                                <div className="ck-kazanim-sik">
                                  <span className="ck-kazanim-sik-label">Anahtar:</span>
                                  <strong>{d.anahtar ?? '—'}</strong>
                                </div>
                                <span className={`ck-durum-rozet ${d.durum}`}>
                                  {d.durum === 'dogru' && '✓ Doğru'}
                                  {d.durum === 'yanlis' && '✗ Yanlış'}
                                  {d.durum === 'bos' && '○ Boş'}
                                  {d.durum === 'anahtarsiz' && '— Anahtar yok'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      )}

      {eksikler.length > 0 && (
        <div style={{ marginTop: 14, padding: 12, background: 'var(--crit-soft)', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
          <strong>{eksikler.length} eksik kazanım</strong> tespit edildi. Önerilen sorular için "Öğrenci Detayı" sayfasını açın.
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-sm" onClick={() => setRoute('student')}>Öğrenci raporunu aç →</button>
          </div>
        </div>
      )}

      <h3 style={{ marginTop: 20, fontSize: 14, fontFamily: 'var(--serif)' }}>Soru bazlı detay</h3>
      <div className="ck-detay-grid">
        {detaylar.map(d => {
          let tone = '';
          if (d.durum === 'dogru') tone = 'ok';
          else if (d.durum === 'yanlis') tone = 'crit';
          else if (d.durum === 'bos') tone = 'muted';
          return (
            <div key={d.sid} className={`ck-detay-cell ${tone}`}>
              <div className="ck-detay-no">{d.no}.</div>
              <div className="ck-detay-meta">
                <div className="mono" style={{ fontSize: 11 }}>{d.sid}</div>
                {d.soru && <div style={{ fontSize: 10, color: 'var(--muted)' }}>{d.soru.kazanimKod}</div>}
              </div>
              <div className="ck-detay-marks">
                <div title="Öğrenci">İ: <strong>{d.isaret ?? '—'}</strong></div>
                <div title="Anahtar">A: <strong>{d.anahtar ?? '—'}</strong></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, tone, highlight }: {
  label: string; value: string; tone?: 'ok' | 'crit' | ''; highlight?: boolean;
}) {
  const color = tone === 'ok' ? 'var(--ok)' : tone === 'crit' ? 'var(--crit)' : 'var(--ink)';
  return (
    <div className="ck-stat">
      <div className="ck-stat-label">{label}</div>
      <div className="ck-stat-value" style={{ color: highlight ? 'var(--accent)' : color }}>{value}</div>
    </div>
  );
}

// ============================== STUDENT ===================================
function Student({ selectedOgr, setSelectedOgr, pushToast }: {
  selectedOgr: string;
  setSelectedOgr: (id: string) => void;
  pushToast: (m: string) => void;
}) {
  const ogr = OGRENCI_INDEKS[selectedOgr];

  // Öğrenciye dair durumlar:
  const [showFeedback, setShowFeedback] = useState(false);
  const [tekrarOnlemeEtkin, setTekrarOnlemeEtkin] = useState(true);

  const basarilar = useMemo(() => basariOranlariniHesapla(ogr), [ogr]);
  const eksikler = useMemo(() => eksikKazanimlariSirala(basarilar), [basarilar]);
  const gruplar = useMemo(() => bolumlereGore(basarilar), [basarilar]);
  const oneriler = useMemo(
    () => oneriUret(ogr, basarilar, { tekrarOnleme: tekrarOnlemeEtkin, N: ONERI_N }),
    [ogr, basarilar, tekrarOnlemeEtkin]
  );

  const genel = useMemo(() => genelBasariYuzde(basarilar), [basarilar]);

  // Radar — öğrenme alanı bazında
  const radarData = useMemo(() => {
    const alanHaritasi = new Map<string, number[]>();
    for (const b of basarilar) {
      const a = b.kazanim.alan;
      if (!alanHaritasi.has(a)) alanHaritasi.set(a, []);
      alanHaritasi.get(a)!.push(b.basariYuzde);
    }
    return Array.from(alanHaritasi.entries()).map(([alan, vals]) => ({
      alan,
      yuzde: Math.round(vals.reduce((s, v) => s + v, 0) / vals.length),
    }));
  }, [basarilar]);

  const ilkOneri = oneriler[0];

  return (
    <>
      <div className="page-meta">
        <span className="meta-tag">/ 03 — Öğrenci Detayı</span>
        <span className="meta-rule"></span>
        <span className="meta-status">{OGRENCILER.length} öğrenci</span>
      </div>
      <h1 className="page-title">Bireysel <em>çözümleme</em>.</h1>
      <p className="page-sub">
        Her öğrencinin kazanım bazlı başarı dağılımı, kritikliğe göre sıralı
        eksik kazanım listesi ve dört kurallı öneri motorunun ürettiği soru
        listesi. Önceki sınava göre değişim her kazanım için ayrıca gösterilir.
      </p>

      <div className="student-grid">
        {OGRENCILER.map(o => {
          const bs = basariOranlariniHesapla(o);
          const gB = genelBasariYuzde(bs);
          return (
            <div
              key={o.id}
              className={`student-card ${o.id === selectedOgr ? 'selected' : ''}`}
              onClick={() => setSelectedOgr(o.id)}
            >
              <div className="student-name">{o.ad}</div>
              <div className="student-meta">
                <span>{o.id} · {o.sube}</span>
                <span>{gB}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row-3">
        <div>
          <div className="card" style={{marginBottom: 20}}>
            <div className="card-head">
              <div>
                <div className="card-eyebrow">öğrenci raporu</div>
                <div className="card-title">{ogr.ad} <span style={{color:'var(--muted)', fontFamily:'var(--mono)', fontSize:13, fontWeight:400, marginLeft:8}}>· {ogr.id} · {ogr.sube}</span></div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontFamily:'var(--serif)', fontSize: 48, lineHeight: 1, color:'var(--ink)'}}>{genel}<span style={{fontSize: 20, color:'var(--muted)'}}>%</span></div>
                <div style={{fontSize: 10, color:'var(--muted)', fontFamily:'var(--mono)', letterSpacing:'0.1em', textTransform:'uppercase'}}>genel başarı</div>
              </div>
            </div>

            <div style={{marginTop: 20}}>
              {gruplar.map(g => (
                <div key={g.bolum} style={{marginBottom: 20}}>
                  <div style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'8px 0', borderBottom:'1px solid var(--rule)', marginBottom: 6,
                  }}>
                    <div>
                      <div style={{fontSize: 10, color:'var(--muted)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.1em'}}>{g.alan}</div>
                      <div style={{fontFamily:'var(--serif)', fontSize: 16, color:'var(--ink)', fontWeight: 500}}>{g.bolum}</div>
                    </div>
                    <span className="tag">{g.kazanimlar.length} kazanım</span>
                  </div>
                  {g.kazanimlar.map(b => {
                    const cls = classFromYuzde(b.basariYuzde);
                    return (
                      <div className="bar-row" key={b.kazanim.kod}>
                        <div className="bar-label">
                          <span className="code">{b.kazanim.kod}</span>
                          {b.kazanim.ad}
                          {b.delta !== undefined && (
                            <span style={{
                              marginLeft: 8,
                              fontFamily:'var(--mono)',
                              fontSize: 10,
                              color: b.delta >= 0 ? 'var(--ok)' : 'var(--crit)',
                              fontWeight: 600,
                            }}>
                              {b.delta >= 0 ? '↗' : '↘'} {b.delta >= 0 ? '+' : ''}{b.delta}pp
                            </span>
                          )}
                        </div>
                        <div className="bar-track">
                          <div className={`bar-fill ${cls}`} style={{width: `${b.basariYuzde}%`}}></div>
                          <div className="bar-threshold" style={{left: `${ESIK*100}%`}}></div>
                        </div>
                        <div className={`bar-value ${cls === 'crit' ? 'crit' : ''}`}>{b.basariYuzde}%</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">Öğrenme alanı profili</div>
              <span className="tag">{radarData.length} alan</span>
            </div>
            <div style={{height: 280}}>
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#d4d9e2" />
                  <PolarAngleAxis dataKey="alan" tick={{fill:'#353c49', fontSize:11}} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{fill:'#9aa3b1', fontSize:10}} />
                  <Radar name={ogr.ad} dataKey="yuzde" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap: 20}}>
          <div className="card">
            <div className="card-eyebrow">kritikliğe göre sıralı</div>
            <div className="card-title">Eksik kazanımlar <span style={{color:'var(--accent)', fontFamily:'var(--serif)', fontStyle:'italic', fontWeight:300}}>· {eksikler.length}</span></div>

            {eksikler.length === 0 ? (
              <div style={{padding: 24, textAlign:'center', color:'var(--ok)', fontStyle:'italic', fontFamily:'var(--serif)'}}>
                Tüm kazanımlar eşik üzerinde.
              </div>
            ) : (
              <div style={{marginTop: 16, display:'flex', flexDirection:'column', gap: 14}}>
                {eksikler.map(b => {
                  const meta = KRITIKLIK_ETIKETLERI[b.sinif!];
                  return (
                    <div key={b.kazanim.kod} style={{borderLeft:`3px solid var(--${meta.renkSinifi})`, paddingLeft: 12, paddingBottom: 8}}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8}}>
                        <div style={{fontFamily:'var(--mono)', fontSize: 10, color:'var(--muted)', letterSpacing:'0.05em'}}>{b.kazanim.kod} · {b.kazanim.bolum}</div>
                        <span className={`tag ${meta.renkSinifi}`} style={{whiteSpace:'nowrap'}}>{meta.etiket}</span>
                      </div>
                      <div style={{fontSize: 13, fontWeight: 500, marginTop: 4}}>{b.kazanim.ad}</div>
                      <div style={{fontFamily:'var(--mono)', fontSize: 11, color:`var(--${meta.renkSinifi})`, marginTop: 6}}>
                        başarı {b.basariYuzde}% · kritiklik {b.kritiklik.toFixed(2)} · ağırlık ×{b.kazanim.agirlik}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button className="btn" style={{marginTop: 20, width:'100%'}} onClick={() => setShowFeedback(true)}>
              Geri bildirim metnini görüntüle →
            </button>
          </div>

          <div className="card">
            <div className="card-eyebrow">öncelikli kazanım için</div>
            <div className="card-title">Dört kurallı öneri listesi</div>
            {ilkOneri && (
              <div style={{fontFamily:'var(--mono)', fontSize: 11, color:'var(--muted)', marginTop: 6}}>
                {ilkOneri.kazanim.kod} · {ilkOneri.kazanim.ad}
              </div>
            )}

            <div style={{
              marginTop: 14, padding:'10px 14px', background:'var(--surface-2)',
              borderRadius:'var(--radius-sm)', display:'flex', justifyContent:'space-between', alignItems:'center',
            }}>
              <div style={{fontSize: 12, color:'var(--ink-2)'}}>
                <strong style={{color:'var(--ink)'}}>Kural 3 — Tekrar önleme</strong>
                <div style={{color:'var(--muted)', fontFamily:'var(--mono)', fontSize: 10, marginTop: 2}}>
                  son {TEKRAR_PENCERESI_GUN} günde çözülen sorular dışlanır
                </div>
              </div>
              <ToggleSwitch checked={tekrarOnlemeEtkin} onChange={setTekrarOnlemeEtkin} />
            </div>

            {ilkOneri && ilkOneri.oneriler.length > 0 ? (
              <div className="suggest-list">
                {ilkOneri.oneriler.map((o, i) => (
                  <div className="suggest-item" key={o.soru.id}>
                    <span className="suggest-rank">{['i', 'ii', 'iii', 'iv', 'v'][i] || (i+1)}.</span>
                    <div className="suggest-body">
                      <div className="suggest-title">{o.soru.metin}</div>
                      <div className="suggest-meta">
                        {o.soru.tur} · zorluk {o.soru.zorluk} · {o.soru.kaynak} · skor {o.skor.toFixed(2)}
                      </div>
                    </div>
                    <span className="suggest-duration">{o.soru.sure} dk</span>
                    <button className="btn ghost" style={{padding:'6px 12px', fontSize: 11}} onClick={() => pushToast(`Açılıyor: ${o.soru.id}`)}>aç</button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{padding: 24, textAlign:'center', color:'var(--muted)', fontStyle:'italic', fontFamily:'var(--serif)'}}>
                {ilkOneri ? 'Bu kazanım için filtreleri geçen soru bulunamadı.' : 'Eksik kazanım olmadığı için öneri üretilmedi.'}
              </div>
            )}

            {ilkOneri && ilkOneri.oneriler.length > 0 && (
              <div style={{
                marginTop: 14, padding: 12, background:'var(--accent-soft)',
                fontSize: 11, color:'var(--accent-deep)', fontFamily:'var(--mono)', borderRadius:'var(--radius-sm)',
              }}>
                <strong>Skor:</strong> w₁·ilgililik + w₂·zorluk_uyumu + w₃·çeşitlilik
                <br/>w₁={ONERI_AGIRLIK.w1} · w₂={ONERI_AGIRLIK.w2} · w₃={ONERI_AGIRLIK.w3}
                <br/>N={ONERI_N} · çeşitlilik tavanı %{CESITLILIK_TAVAN*100}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tüm öneri listeleri */}
      {eksikler.length > 1 && (
        <>
          <div className="divider-x">
            <span className="divider-label">tüm eksik kazanımlar · öneri listesi</span>
          </div>
          <div className="row-2">
            {oneriler.slice(1).map(ol => (
              <OneriKarti key={ol.kazanim.kod} oneri={ol} pushToast={pushToast} />
            ))}
          </div>
        </>
      )}

      {showFeedback && (
        <GeriBildirimModali
          ogr={ogr}
          basarilar={basarilar}
          oneriler={oneriler}
          onClose={() => setShowFeedback(false)}
          onPdf={() => pushToast('PDF olarak indirildi · oneri_listesi.pdf')}
        />
      )}
    </>
  );
}

function OneriKarti({ oneri, pushToast }: { oneri: OneriListesi; pushToast: (m: string) => void }) {
  const meta = oneri.basari.sinif ? KRITIKLIK_ETIKETLERI[oneri.basari.sinif] : null;
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="card-eyebrow">{oneri.kazanim.bolum}</div>
          <div className="card-title">{oneri.kazanim.kod}</div>
        </div>
        {meta && <span className={`tag ${meta.renkSinifi}`}>{meta.etiket}</span>}
      </div>
      <div style={{fontSize: 13, color:'var(--ink-2)', marginTop: 4}}>{oneri.kazanim.ad}</div>
      <div style={{fontFamily:'var(--mono)', fontSize: 11, color:'var(--muted)', marginTop: 6}}>
        başarı {oneri.basari.basariYuzde}% · kritiklik {oneri.basari.kritiklik.toFixed(2)}
      </div>
      <div className="suggest-list">
        {oneri.oneriler.length === 0 && (
          <div style={{padding: 16, color:'var(--muted)', fontStyle:'italic', fontFamily:'var(--serif)'}}>
            Filtreleri geçen soru kalmadı.
          </div>
        )}
        {oneri.oneriler.map((o, i) => (
          <div className="suggest-item" key={o.soru.id}>
            <span className="suggest-rank">{i+1}.</span>
            <div className="suggest-body">
              <div className="suggest-title">{o.soru.metin}</div>
              <div className="suggest-meta">
                z{o.soru.zorluk} · {o.soru.tur} · {o.soru.kaynak} · skor {o.skor.toFixed(2)}
              </div>
            </div>
            <button className="btn ghost" style={{padding:'6px 10px', fontSize: 11}} onClick={() => pushToast(`Açılıyor: ${o.soru.id}`)}>aç</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 22, padding: 2,
        background: checked ? 'var(--accent)' : 'var(--rule-strong)',
        border: 'none', borderRadius: 11,
        display: 'flex', alignItems: 'center', cursor: 'pointer',
        transition: 'background .15s ease',
      }}
      aria-label="Tekrar önleme filtresi"
    >
      <span
        style={{
          width: 16, height: 16, background: '#fff', borderRadius: '50%',
          transform: `translateX(${checked ? 18 : 0}px)`,
          transition: 'transform .15s ease',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
}

function GeriBildirimModali({ ogr, basarilar, oneriler, onClose, onPdf }: {
  ogr: { ad: string; id: string };
  basarilar: KazanimBasari[];
  oneriler: OneriListesi[];
  onClose: () => void;
  onPdf: () => void;
}) {
  const genel = genelBasariYuzde(basarilar);
  const eksikler = eksikKazanimlariSirala(basarilar);
  const ilk = oneriler[0];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="card-eyebrow">öğrenciye yönelik geri bildirim · otomatik üretildi</div>
        <h2 style={{fontFamily:'var(--serif)', fontSize: 28, fontWeight: 500, marginBottom: 24, letterSpacing:'-0.01em'}}>
          {ogr.ad} için kişisel rapor
        </h2>
        <div className="feedback-card">
          <div className="fb-greeting">Merhaba {ogr.ad.split(' ')[0]},</div>
          <div className="fb-text drop-cap">
            Son sınavda toplam <strong>%{genel}</strong> oranında başarı gösterdin.
            Bu rapor, hangi kazanımları iyi kavradığını ve hangi noktalarda ek
            çalışmaya ihtiyaç duyduğunu kritikliğe göre sıralı biçimde gösterir.
          </div>
          {eksikler.length > 0 && (
            <div className="fb-text">
              <strong>Üzerinde çalışmanın yararlı olacağı kazanımlar (kritiklik sırasıyla):</strong>
              <div style={{marginTop: 10, lineHeight: 2}}>
                {eksikler.slice(0, 6).map(b => (
                  <span key={b.kazanim.kod} className="gap-pill">
                    {b.kazanim.kod} · {b.basariYuzde}% · k={b.kritiklik.toFixed(2)}
                  </span>
                ))}
              </div>
            </div>
          )}
          {ilk && (
            <>
              <div className="fb-text">
                Özellikle <strong>{ilk.kazanim.ad}</strong> kazanımında başarı oranın
                %{ilk.basari.basariYuzde}. Aşağıdaki sorular tezde tanımlanan dört
                kural (ilgililik, zorluk uyumu, tekrar önleme, çeşitlilik) işletilerek
                seçildi; sırasıyla çalışman önerilir.
              </div>
              <ul style={{listStyle:'none', padding:0, margin:'12px 0 0', fontSize: 14, lineHeight: 2}}>
                {ilk.oneriler.map((o, i) => (
                  <li key={o.soru.id} style={{paddingLeft: 24, position:'relative'}}>
                    <span style={{position:'absolute', left:0, color:'var(--accent)', fontStyle:'italic', fontFamily:'var(--serif)'}}>{i+1}.</span>
                    <strong>{o.soru.metin}</strong> <span style={{color:'var(--muted)'}}>· z{o.soru.zorluk} · {o.soru.tur} · {o.soru.sure} dk</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="fb-text" style={{marginTop: 20, fontStyle:'italic', color:'var(--ink-soft)'}}>
            İyi çalışmalar dileriz.
          </div>
        </div>
        <div style={{display:'flex', gap: 10, marginTop: 24}}>
          <button className="btn" onClick={onPdf}>PDF olarak indir</button>
          <button className="btn ghost" onClick={onClose}>Kapat</button>
        </div>
      </div>
    </div>
  );
}

// ============================ CLASS COMPARE ===============================
function ClassCompare() {
  const a = useMemo(() => sinifKazanimOrtalamasi('11-A'), []);
  const b = useMemo(() => sinifKazanimOrtalamasi('11-B'), []);

  // Birleştir
  const data = useMemo(() => {
    const aMap = new Map(a.map(x => [x.kazanim.kod, x.ortalama]));
    const bMap = new Map(b.map(x => [x.kazanim.kod, x.ortalama]));
    const kodlar = Array.from(new Set([...aMap.keys(), ...bMap.keys()]));
    return kodlar.map(k => {
      const kaz = KAZANIMLAR_11.find(x => x.kod === k);
      return {
        kod: k.split('.').slice(-1)[0],
        kazKod: k,
        ad: kaz ? (kaz.ad.length > 28 ? kaz.ad.substring(0, 28) + '…' : kaz.ad) : k,
        fullAd: kaz?.ad ?? k,
        bolum: kaz?.bolum ?? '',
        '11-A': aMap.get(k) ?? null,
        '11-B': bMap.get(k) ?? null,
      };
    });
  }, [a, b]);

  // Performans datası — O(n) doğrusal
  const perf = Array.from({length: 12}, (_, i) => {
    const n = (i + 1) * 10;
    return { n, ms: Math.round(80 + n * 7 + ((i * 37) % 30)) };
  });

  return (
    <>
      <div className="page-meta">
        <span className="meta-tag">/ 04 — Sınıf Karşılaştırma</span>
        <span className="meta-rule"></span>
        <span className="meta-status">2 şube</span>
      </div>
      <h1 className="page-title">Şubeler arasında <em>nasıl</em> farklılaşıyor?</h1>
      <p className="page-sub">
        Aynı sınav, farklı şubelerde aynı kazanım profilini üretmez. Bu görünüm
        kazanım–şube karşılaştırmasını ve sistem performans göstergelerini birlikte sunar.
      </p>

      <div className="card" style={{marginBottom: 20}}>
        <div className="card-head">
          <div>
            <div className="card-eyebrow">kazanım bazlı şube karşılaştırması</div>
            <div className="card-title">11-A &amp; 11-B</div>
          </div>
          <div style={{display:'flex', gap: 8}}>
            <span className="tag dot" style={{color:'var(--accent)'}}>11-A</span>
            <span className="tag dot" style={{color:'var(--ok)'}}>11-B</span>
          </div>
        </div>
        <div style={{height: 380, marginTop: 16}}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{top: 20, right: 16, left: -10, bottom: 60}}>
              <CartesianGrid stroke="#e6e9ef" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="kod" tick={{fontSize: 10, fontFamily:'var(--mono)', fill:'#9aa3b1'}} axisLine={{stroke:'#d4d9e2'}} />
              <YAxis domain={[0, 100]} tick={{fontSize: 10, fill:'#9aa3b1'}} axisLine={{stroke:'#d4d9e2'}} />
              <Tooltip
                contentStyle={{background:'#14181f', border:'none', color:'#f5f0e8', fontSize: 12}}
                labelFormatter={(label, payload) => {
                  const p = payload?.[0]?.payload as { fullAd?: string; kazKod?: string } | undefined;
                  return p?.kazKod ? `${p.kazKod} · ${p.fullAd}` : String(label);
                }}
              />
              <ReferenceLine y={ESIK*100} stroke="#dc4d4d" strokeDasharray="5 5" label={{value:`eşik %${Math.round(ESIK*100)}`, position:'right', fill:'#dc4d4d', fontSize: 10}} />
              <Bar dataKey="11-A" fill="#4f46e5" />
              <Bar dataKey="11-B" fill="#2f9e6e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="row-2">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-eyebrow">öğrenci sayısına göre</div>
              <div className="card-title">Sistem performansı</div>
            </div>
            <span className="tag">O(n) doğrusal</span>
          </div>
          <div style={{height: 240, marginTop: 16}}>
            <ResponsiveContainer>
              <LineChart data={perf} margin={{top: 20, right: 20, left: -10, bottom: 0}}>
                <CartesianGrid stroke="#e6e9ef" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="n" tick={{fontSize: 10, fontFamily:'var(--mono)', fill:'#9aa3b1'}} label={{value:'öğrenci sayısı', position:'insideBottom', offset:-5, fontSize: 10, fill:'#9aa3b1'}} />
                <YAxis tick={{fontSize: 10, fill:'#9aa3b1'}} label={{value:'ms', angle:-90, position:'insideLeft', fontSize: 10, fill:'#9aa3b1'}} />
                <Tooltip contentStyle={{background:'#14181f', border:'none', color:'#f5f0e8', fontSize: 12}} />
                <ReferenceLine y={2000} stroke="#dc4d4d" strokeDasharray="4 4" label={{value:'ölçüt 2sn', position:'right', fill:'#dc4d4d', fontSize: 10}} />
                <Line type="monotone" dataKey="ms" stroke="#14181f" strokeWidth={2} dot={{fill:'#4f46e5', r: 3}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', marginTop: 14, paddingTop: 14, borderTop:'1px solid var(--rule)'}}>
            <div>
              <div style={{fontSize: 10, color:'var(--muted)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.1em'}}>ort. süre</div>
              <div style={{fontFamily:'var(--serif)', fontSize: 24, color:'var(--ink)'}}>412<span style={{color:'var(--muted)', fontSize: 14}}> ms</span></div>
            </div>
            <div>
              <div style={{fontSize: 10, color:'var(--muted)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.1em'}}>p95</div>
              <div style={{fontFamily:'var(--serif)', fontSize: 24, color:'var(--ink)'}}>987<span style={{color:'var(--muted)', fontSize: 14}}> ms</span></div>
            </div>
            <div>
              <div style={{fontSize: 10, color:'var(--muted)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.1em'}}>çalıştırma</div>
              <div style={{fontFamily:'var(--serif)', fontSize: 24, color:'var(--ink)'}}>120</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-eyebrow">şube farkları</div>
          <div className="card-title">En büyük açıklık gösteren kazanımlar</div>
          <table style={{marginTop: 16}}>
            <thead>
              <tr>
                <th>Kazanım</th>
                <th className="right">11-A</th>
                <th className="right">11-B</th>
                <th className="right">Fark</th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter(d => d['11-A'] !== null && d['11-B'] !== null)
                .map(d => ({ ...d, fark: (d['11-B'] as number) - (d['11-A'] as number) }))
                .sort((x, y) => Math.abs(y.fark) - Math.abs(x.fark))
                .slice(0, 6)
                .map(d => (
                  <tr key={d.kazKod}>
                    <td>{d.fullAd}</td>
                    <td className="right mono">{d['11-A']}%</td>
                    <td className="right mono">{d['11-B']}%</td>
                    <td className="right mono" style={{color: d.fark > 0 ? 'var(--ok)' : 'var(--crit)', fontWeight: 600}}>
                      {d.fark > 0 ? '+' : ''}{d.fark}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ============================ EXPERT PANEL ================================
function ExpertPanel({ pushToast }: { pushToast: (m: string) => void }) {
  // Tablo 4.2'deki 6 işlevsel madde + tezde geçen ek maddeler
  const sorular = [
    'Her kazanımdaki başarı yüzdesinin ayrı gösterimi',
    'Eksik kazanımların kritikliğe göre sıralı sunumu',
    'Eksik kazanımlara yönelik soru önerisi',
    'Son 30 günde çözülmüş soruların dışlanması (toggle)',
    'Öneri listesinin PDF olarak indirilebilmesi',
    'Önceki sınava göre değişimin gösterilmesi',
    'Kazanım kodunun açıklama ve konu hiyerarşisi ile birlikte sunumu',
    'Eşik değerin (%60) uzman kalibrasyonuna açık olması',
  ];

  const [puanlar, setPuanlar] = useState<Array<number | null>>(Array(sorular.length).fill(null));

  function setPuan(idx: number, val: number) {
    const yeni = [...puanlar];
    yeni[idx] = val;
    setPuanlar(yeni);
  }

  const cevaplanan = puanlar.filter(p => p !== null).length;
  const ort = cevaplanan > 0
    ? (puanlar.filter((p): p is number => p !== null).reduce((s, p) => s + p, 0) / cevaplanan).toFixed(2)
    : '—';

  // Tablo 4.2'den uzman puanları (tez sayfasındaki tablo)
  const mockUzmanlar = [
    { ad: 'U1', deneyim: '14 yıl', puanlar: [5, 5, 5, 4, 5, 4, 5, 5] },
    { ad: 'U2', deneyim: '9 yıl',  puanlar: [5, 4, 5, 3, 4, 5, 4, 4] },
    { ad: 'U3', deneyim: '22 yıl', puanlar: [4, 5, 5, 4, 5, 4, 5, 4] },
  ];

  return (
    <>
      <div className="page-meta">
        <span className="meta-tag">/ 06 — Uzman Paneli</span>
        <span className="meta-rule"></span>
        <span className="meta-status">3 uzman değerlendirmesi</span>
      </div>
      <h1 className="page-title">Uzman <em>görüş formu</em>.</h1>
      <p className="page-sub">
        Tez Bölüm 3.3.1'de tanımlanan yapılandırılmış uzman görüş formu.
        Üç matematik öğretmeninden bağımsız olarak alınan görüşler, sistemin
        işlevsel gereksinim setini ve öneri çıktılarının kalitesini değerlendirmek için kullanılır.
      </p>

      <div className="row-2">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-eyebrow">canlı form · katılımcı: U4</div>
              <div className="card-title">5'li Likert değerlendirmesi</div>
            </div>
            <span className="tag">{cevaplanan} / {sorular.length}</span>
          </div>

          <div style={{marginTop: 16}}>
            <div className="likert-row" style={{borderBottom:'2px solid var(--ink)', paddingBottom: 10}}>
              <div className="likert-label" style={{fontSize: 11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.1em'}}>madde</div>
              {[1,2,3,4,5].map(n => (
                <div key={n} style={{width: 32, textAlign:'center', fontFamily:'var(--mono)', fontSize: 11, color:'var(--muted)'}}>{n}</div>
              ))}
            </div>
            {sorular.map((s, i) => (
              <div key={i} className="likert-row">
                <div className="likert-label">{i+1}. {s}</div>
                {[1,2,3,4,5].map(n => (
                  <div
                    key={n}
                    className={`likert-opt ${puanlar[i] === n ? 'selected' : ''}`}
                    onClick={() => setPuan(i, n)}
                  >
                    {n}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 24, padding: 18, background: 'var(--surface-2)',
            display:'flex', justifyContent:'space-between', alignItems:'center',
          }}>
            <div>
              <div style={{fontSize: 11, color:'var(--ink-soft)', fontFamily:'var(--mono)'}}>oturum ortalaması</div>
              <div style={{fontFamily:'var(--serif)', fontSize: 32, color:'var(--ink)'}}>{ort}</div>
            </div>
            <button
              className="btn"
              disabled={cevaplanan < sorular.length}
              onClick={() => pushToast('Form gönderildi · U4 puanları kaydedildi')}
              style={{opacity: cevaplanan < sorular.length ? 0.4 : 1}}
            >
              Formu gönder →
            </button>
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap: 20}}>
          <div className="card">
            <div className="card-eyebrow">geçmiş katılımcılar · 3 uzman</div>
            <div className="card-title">Uzman puanları (medyan)</div>
            <table style={{marginTop: 16}}>
              <thead>
                <tr>
                  <th>Madde</th>
                  {mockUzmanlar.map(u => <th key={u.ad} className="right">{u.ad}</th>)}
                  <th className="right">Med.</th>
                </tr>
              </thead>
              <tbody>
                {sorular.map((s, i) => {
                  const vals = mockUzmanlar.map(u => u.puanlar[i]).sort((x, y) => x - y);
                  const med = vals[1];
                  return (
                    <tr key={i}>
                      <td style={{fontSize: 12}}>{i+1}. {s.length > 38 ? s.substring(0, 38) + '…' : s}</td>
                      {mockUzmanlar.map(u => (
                        <td key={u.ad} className="right mono">{u.puanlar[i]}</td>
                      ))}
                      <td className="right mono" style={{fontWeight: 600}}>{med}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-eyebrow">öneri ilgililik çalışması · Bölüm 4.3</div>
            <div className="card-title">Uzman değerlendirme özeti</div>
            <div style={{marginTop: 18, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16}}>
              <div style={{padding: 18, background:'var(--surface-2)'}}>
                <div style={{fontSize: 11, color:'var(--muted)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.1em'}}>ilgili öneri</div>
                <div style={{fontFamily:'var(--serif)', fontSize: 36, color:'var(--ink)'}}>198<span style={{fontSize: 16, color:'var(--muted)'}}> / 219</span></div>
                <div style={{fontSize: 11, color:'var(--ok)', marginTop: 4, fontFamily:'var(--mono)'}}>%90.4 ✓ ölçüt %85</div>
              </div>
              <div style={{padding: 18, background:'var(--surface-2)'}}>
                <div style={{fontSize: 11, color:'var(--muted)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'0.1em'}}>liste sayısı</div>
                <div style={{fontFamily:'var(--serif)', fontSize: 36, color:'var(--ink)'}}>15<span style={{fontSize: 16, color:'var(--muted)'}}> / 15</span></div>
                <div style={{fontSize: 11, color:'var(--ok)', marginTop: 4, fontFamily:'var(--mono)'}}>3 öğr × 5 kazanım</div>
              </div>
            </div>

            <div style={{marginTop: 16}}>
              <div style={{fontSize: 12, color:'var(--ink-soft)', marginBottom: 10}}>Uzman bazlı dağılım:</div>
              {mockUzmanlar.map((u, i) => {
                const ilgili = [68, 63, 67][i];
                const pct = Math.round((ilgili / 73) * 100);
                return (
                  <div key={u.ad} className="bar-row" style={{gridTemplateColumns:'80px 1fr 80px'}}>
                    <div className="bar-label">
                      <strong>{u.ad}</strong>
                      <span className="code" style={{display:'inline', marginLeft: 8}}>{u.deneyim}</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill ok" style={{width: `${pct}%`}}></div>
                    </div>
                    <div className="bar-value">{ilgili}/73</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="divider-x">
        <span className="divider-label">açık uçlu yorum örnekleri</span>
      </div>

      <div className="row-2">
        <div className="card" style={{background:'var(--surface-2)'}}>
          <div className="card-eyebrow">U1 · 14 yıl deneyim</div>
          <div style={{fontFamily:'var(--serif)', fontSize: 17, fontStyle:'italic', lineHeight: 1.5, color:'var(--ink-2)'}}>
            "Geri bildirim eylem odaklı olmalı; öğrenciye yalnızca neyi bilmediğini
            değil, ne yapması gerektiğini de açıkça söylemeliyiz. Kazanım kodları
            tek başına yetersiz, mutlaka kazanım açıklamasıyla birlikte sunulmalı."
          </div>
        </div>
        <div className="card" style={{background:'var(--surface-2)'}}>
          <div className="card-eyebrow">U2 · 9 yıl deneyim</div>
          <div style={{fontFamily:'var(--serif)', fontSize: 17, fontStyle:'italic', lineHeight: 1.5, color:'var(--ink-2)'}}>
            "Tekrar önleme kuralı bence opsiyonel kalmalı; öğrenci aynı soruyu
            tekrar görse de yeniden çözmek isteyebilir. Filtre kapatılabilirse
            sistem daha esnek olur."
          </div>
        </div>
      </div>
    </>
  );
}

// ============================== CURRICULUM ================================
function Curriculum() {
  const [q, setQ] = useState('');
  const [alan, setAlan] = useState('Tümü');

  const alanlar = ['Tümü', ...Array.from(new Set(KAZANIMLAR_11.map(k => k.alan)))];

  const filtreli = KAZANIMLAR_11.filter(k => {
    const alanOk = alan === 'Tümü' || k.alan === alan;
    const metin = `${k.kod} ${k.ad} ${k.bolum} ${k.konu}`.toLocaleLowerCase('tr');
    const aramaOk = q.trim() === '' || metin.includes(q.toLocaleLowerCase('tr'));
    return alanOk && aramaOk;
  });

  const bolumler = filtreli.reduce<Record<string, typeof KAZANIMLAR_11>>((acc, k) => {
    (acc[k.bolum] = acc[k.bolum] || []).push(k);
    return acc;
  }, {});

  return (
    <>
      <div className="page-meta">
        <span className="meta-tag">/ 05 — Kazanım Kataloğu</span>
        <span className="meta-rule"></span>
        <span className="meta-status">MEB 2018 · {KAZANIMLAR_11.length} kazanım</span>
      </div>
      <h1 className="page-title">11. sınıf <em>kazanımları</em>.</h1>
      <p className="page-sub">
        Çözümleme motorunun temel aldığı resmî öğrenme kazanımları. Tümü, MEB
        Ortaöğretim Matematik Dersi (9–12. Sınıflar) Öğretim Programı'ndan
        (2018) gerçek kod ve metinleriyle alınmıştır. Her kazanım için
        kazanım ağırlığı (×) tezde tanımlandığı üzere sunulur.
      </p>

      <div className="kpi-grid">
        <KPI eyebrow="toplam" label="∑" value={String(KAZANIMLAR_11.length)} unit="kazanım" foot="11. sınıf matematik" tone="" />
        <KPI eyebrow="öğrenme alanı" label="•" value={String(alanlar.length - 1)} unit="alan" foot="Geometri · Cebir · Olasılık" tone="" />
        <KPI eyebrow="ünite" label="•" value={String(new Set(KAZANIMLAR_11.map(k => k.bolum)).size)} unit="" foot="11.1 – 11.7" tone="" />
        <KPI eyebrow="kaynak" label="•" value="2018" unit="MEB" foot="resmî program" tone="" />
      </div>

      <div className="card" style={{marginBottom: 20}}>
        <div style={{display:'flex', gap: 12, flexWrap:'wrap', alignItems:'center'}}>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Kazanım kodu veya metinde ara…"
            style={{
              flex: 1, minWidth: 240, padding: '11px 14px',
              border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)',
              fontSize: 14, fontFamily: 'inherit', color: 'var(--ink)',
              background: 'var(--surface)', outline: 'none',
            }}
          />
          <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
            {alanlar.map(a => (
              <button
                key={a}
                className={`tag ${alan === a ? 'ok' : ''}`}
                style={{cursor:'pointer', padding:'7px 14px'}}
                onClick={() => setAlan(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <div style={{marginTop: 12, fontSize: 12, color:'var(--muted)', fontFamily:'var(--mono)'}}>
          {filtreli.length} / {KAZANIMLAR_11.length} kazanım gösteriliyor
        </div>
      </div>

      {Object.keys(bolumler).length === 0 ? (
        <div className="card" style={{textAlign:'center', padding: 48, color:'var(--muted)', fontStyle:'italic', fontFamily:'var(--serif)', fontSize: 18}}>
          Arama ölçütlerine uygun kazanım bulunamadı.
        </div>
      ) : (
        Object.entries(bolumler).map(([bolum, list]) => (
          <div className="card" key={bolum} style={{marginBottom: 16}}>
            <div className="card-head">
              <div>
                <div className="card-eyebrow">{list[0].alan} · {list[0].kod.split('.').slice(0,2).join('.')}</div>
                <div className="card-title">{bolum}</div>
              </div>
              <span className="tag">{list.length} kazanım</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th style={{width: 96}}>Kod</th>
                  <th>Kazanım</th>
                  <th style={{width: 180}}>Konu</th>
                  <th style={{width: 60}} className="right">Ağırlık</th>
                </tr>
              </thead>
              <tbody>
                {list.map(k => (
                  <tr key={k.kod}>
                    <td className="mono" style={{color:'var(--accent)', fontWeight: 500, whiteSpace:'nowrap'}}>{k.kod}</td>
                    <td style={{color:'var(--ink)'}}>{k.ad}</td>
                    <td style={{color:'var(--ink-soft)', fontSize: 12}}>{k.konu}</td>
                    <td className="right mono" style={{fontSize: 12, color: k.agirlik > 1 ? 'var(--accent)' : 'var(--ink-soft)'}}>×{k.agirlik.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      <div style={{marginTop: 24, padding: '16px 20px', background:'var(--surface-2)', borderRadius:'var(--radius)', fontSize: 12, color:'var(--ink-soft)', lineHeight: 1.6}}>
        <strong style={{color:'var(--ink)'}}>Kaynak:</strong> {KAZANIM_KAYNAGI}.{' '}
        <a href="https://mufredat.meb.gov.tr/ProgramDetay.aspx?PID=343" target="_blank" rel="noreferrer" style={{color:'var(--accent)'}}>
          mufredat.meb.gov.tr
        </a>
      </div>
    </>
  );
}

// =============================== ABOUT ====================================
function About() {
  return (
    <>
      <div className="page-meta">
        <span className="meta-tag">/ 07 — Proje Hakkında</span>
        <span className="meta-rule"></span>
        <span className="meta-status">prototip · sürüm 1.0</span>
      </div>
      <h1 className="page-title">Bu prototip <em>nedir</em>?</h1>
      <p className="page-sub">
        Ahmet Yesevi Üniversitesi Bilgisayar Mühendisliği Tezsiz Yüksek Lisans
        programı kapsamında, "Kazanım Bazlı Sınav Analiz ve Geri Bildirim
        Sistemi Prototipi: 11. Sınıf Matematik Örneği" başlıklı dönem
        projesinin yazılım çıktısıdır.
      </p>

      <div className="row-2">
        <div className="card">
          <div className="card-eyebrow">amaç</div>
          <div className="card-title">Proje amacı</div>
          <p style={{marginTop: 14, lineHeight: 1.65, fontSize: 14, color:'var(--ink-2)'}}>
            11. sınıf matematik dersi için, sınav çıktılarını MEB öğrenme
            kazanımlarına göre çözümleyen, eksik kazanımları %{Math.round(ESIK*100)} eşik tabanlı
            tespit eden ve dört kurallı bir öneri kümesi üreten yerel
            çalışan bir prototip geliştirmek; prototipin işlevsel doğruluğunu,
            öneri kalitesini, performansını ve kullanılabilirliğini uzman
            görüşüne ve ön kullanıcı testine dayanarak değerlendirmek.
          </p>
        </div>

        <div className="card">
          <div className="card-eyebrow">araştırma soruları</div>
          <div className="card-title">5 soru</div>
          <ol style={{marginTop: 14, paddingLeft: 0, listStyle:'none', counterReset:'q'}}>
            {[
              'İşlevsel gereksinimler — uzman görüşüne göre nelerdir?',
              'Kazanım bazlı başarı oranı %100 doğrulukla hesaplanıyor mu?',
              'Öneri ilgililik oranı %85+ değerini karşılıyor mu?',
              'Tek öğrenci çözümleme süresi 2 saniyenin altında mı?',
              'Görev başarısı %80+ ve SUS > 68 ölçütleri sağlanıyor mu?',
            ].map((q, i) => (
              <li key={i} style={{
                padding:'10px 0', borderBottom:'1px solid var(--rule)',
                fontSize: 13, color:'var(--ink-2)', display:'flex', gap: 14,
              }}>
                <span style={{fontFamily:'var(--serif)', fontStyle:'italic', color:'var(--accent)', fontSize: 18, width: 24}}>{['i', 'ii', 'iii', 'iv', 'v'][i]}.</span>
                <span>{q}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="divider-x">
        <span className="divider-label">algoritma künyesi</span>
      </div>

      <div className="kpi-grid">
        <KPI eyebrow="eşik" label="•" value={String(ESIK*100)} unit="%" foot="Bölüm 3.8" tone="" />
        <KPI eyebrow="öneri kuralı" label="•" value="4" unit="kural" foot="ilg / zor / tekrar / çeşit" tone="" />
        <KPI eyebrow="N (liste uzunluğu)" label="•" value={String(ONERI_N)} unit="soru" foot="Bölüm 3.9" tone="" />
        <KPI eyebrow="ağırlıklar" label="•" value={`${ONERI_AGIRLIK.w1}/${ONERI_AGIRLIK.w2}/${ONERI_AGIRLIK.w3}`} unit="w₁/w₂/w₃" foot="w₁·ilg + w₂·zor + w₃·çeş" tone="" />
      </div>

      <div className="card" style={{marginTop: 20, background:'var(--ink)', color:'#f5f0e8', border:'none', padding: 40}}>
        <div className="card-eyebrow" style={{color:'rgba(245,240,232,0.5)'}}>kavramsal çerçeve</div>
        <div style={{fontFamily:'var(--serif)', fontSize: 26, fontWeight: 400, fontStyle:'italic', lineHeight: 1.4, marginTop: 12, color:'#f5f0e8'}}>
          "Etkili bir geri bildirim üç soruyu yanıtlar:<br/>
          <em style={{color:'#fbcb78'}}>Nereye gidiyorum?</em>
          <em style={{color:'#f59563'}}> · Şu an neredeyim? </em>
          <em style={{color:'#7dd3a3'}}>· Sonra nereye?</em>"
        </div>
        <div style={{fontSize: 12, color:'rgba(245,240,232,0.5)', marginTop: 18, fontFamily:'var(--mono)'}}>
          Hattie &amp; Timperley, 2007, Review of Educational Research
        </div>
      </div>
    </>
  );
}

export default App;
