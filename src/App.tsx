import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, ReferenceLine,
} from 'recharts';
import { KAZANIMLAR_11, KAZANIM_KAYNAGI } from './kazanimlar';
import './App.css';

// ================== MOCK DATA ==================
const KAZANIMLAR = [
  { kod: '11.1.1.1', ad: 'Trigonometrik fonksiyonların grafikleri', dal: 'Trigonometri' },
  { kod: '11.1.1.2', ad: 'Sinüs ve kosinüs teoremleri', dal: 'Trigonometri' },
  { kod: '11.1.1.3', ad: 'Toplam-fark formülleri', dal: 'Trigonometri' },
  { kod: '11.2.1.1', ad: 'Üstel fonksiyonlar ve özellikleri', dal: 'Üstel-Logaritmik' },
  { kod: '11.2.1.2', ad: 'Logaritma kuralları', dal: 'Üstel-Logaritmik' },
  { kod: '11.2.2.1', ad: 'Üstel ve logaritmik denklemler', dal: 'Üstel-Logaritmik' },
  { kod: '11.3.1.1', ad: 'Diziler ve genel terim', dal: 'Diziler' },
  { kod: '11.3.1.2', ad: 'Aritmetik ve geometrik diziler', dal: 'Diziler' },
  { kod: '11.4.1.1', ad: 'Limit kavramı ve hesabı', dal: 'Türev' },
  { kod: '11.4.2.1', ad: 'Türev tanımı ve kuralları', dal: 'Türev' },
  { kod: '11.4.2.2', ad: 'Türev uygulamaları (en büyük-en küçük)', dal: 'Türev' },
  { kod: '11.5.1.1', ad: 'Olasılık ve koşullu olasılık', dal: 'Olasılık' },
];

const OGRENCILER = [
  { id: 'O01', ad: 'Ayşe K.', sube: '11-A', kazanimlar: [85, 80, 70, 90, 88, 78, 92, 85, 35, 42, 38, 90] },
  { id: 'O02', ad: 'Mehmet Y.', sube: '11-A', kazanimlar: [72, 65, 60, 78, 70, 55, 80, 75, 68, 70, 65, 82] },
  { id: 'O03', ad: 'Elif D.', sube: '11-A', kazanimlar: [95, 92, 88, 90, 92, 85, 95, 90, 78, 80, 75, 95] },
  { id: 'O04', ad: 'Can A.', sube: '11-A', kazanimlar: [60, 55, 45, 65, 58, 40, 70, 60, 30, 35, 28, 75] },
  { id: 'O05', ad: 'Zeynep T.', sube: '11-A', kazanimlar: [78, 75, 70, 82, 80, 72, 88, 82, 45, 52, 48, 85] },
  { id: 'O06', ad: 'Ali R.', sube: '11-B', kazanimlar: [82, 78, 72, 85, 82, 76, 88, 84, 55, 58, 52, 88] },
  { id: 'O07', ad: 'Selin O.', sube: '11-B', kazanimlar: [70, 68, 62, 72, 68, 60, 78, 72, 38, 45, 40, 80] },
];

const SUBELER = ['11-A', '11-B'];
const ESIK = 50;

// Mock öneriler havuzu (kazanım koduna göre)
const ONERILER = {
  '11.4.1.1': [
    { ad: 'Limitin epsilon-delta tanımı — kavram özeti', tur: 'Temel kavram', sure: 12 },
    { ad: 'Sağ ve sol limit — örnek çözüm', tur: 'Örnek çözüm', sure: 15 },
    { ad: 'Limit alıştırmaları — kademeli set', tur: 'Alıştırma', sure: 20 },
  ],
  '11.4.2.1': [
    { ad: 'Türevin geometrik anlamı — kavram özeti', tur: 'Temel kavram', sure: 10 },
    { ad: 'Polinom türevi adım adım — örnek', tur: 'Örnek çözüm', sure: 14 },
    { ad: 'Çarpım ve bölüm kuralı alıştırmaları', tur: 'Alıştırma', sure: 18 },
  ],
  '11.4.2.2': [
    { ad: 'En büyük-en küçük değer problemleri özeti', tur: 'Temel kavram', sure: 12 },
    { ad: 'Optimizasyon örnek soru çözümü', tur: 'Örnek çözüm', sure: 16 },
    { ad: 'Türev uygulama soruları (15 soru)', tur: 'Alıştırma', sure: 22 },
  ],
  '11.2.2.1': [
    { ad: 'Üstel denklemler — temel yöntemler', tur: 'Temel kavram', sure: 11 },
    { ad: 'Logaritmik denklem örneği', tur: 'Örnek çözüm', sure: 14 },
    { ad: 'Karma denklem alıştırmaları', tur: 'Alıştırma', sure: 18 },
  ],
  '11.1.1.3': [
    { ad: 'Toplam-fark formülleri kavram haritası', tur: 'Temel kavram', sure: 10 },
    { ad: 'Formül uygulamalı örnek soru', tur: 'Örnek çözüm', sure: 13 },
    { ad: 'Toplam-fark karma alıştırmalar', tur: 'Alıştırma', sure: 17 },
  ],
};

const SIKLAR = ['A', 'B', 'C', 'D', 'E'];

// Hesaplama yardımcıları
function ortalamaKazanim(ogrenciler, idx) {
  return Math.round(ogrenciler.reduce((s, o) => s + o.kazanimlar[idx], 0) / ogrenciler.length);
}

function eksikKazanimlar(ogr) {
  return KAZANIMLAR
    .map((k, i) => ({ ...k, idx: i, yuzde: ogr.kazanimlar[i] }))
    .filter(k => k.yuzde < ESIK)
    .sort((a, b) => a.yuzde - b.yuzde);
}

function genelBasari(ogr) {
  return Math.round(ogr.kazanimlar.reduce((s, v) => s + v, 0) / ogr.kazanimlar.length);
}

// ================== APP ==================
function App() {
  const [route, setRoute] = useState('overview');
  const [selectedOgr, setSelectedOgr] = useState('O04');
  const [toasts, setToasts] = useState([]);

  const ogr = OGRENCILER.find(o => o.id === selectedOgr);

  function pushToast(msg) {
    const id = Date.now();
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }

  return (
    <div className="app">
      <Sidebar route={route} setRoute={setRoute} />
      <main className="main">
        {route === 'overview' && <Overview pushToast={pushToast} />}
        {route === 'upload' && <Upload pushToast={pushToast} setRoute={setRoute} />}
        {route === 'student' && (
          <Student
            selectedOgr={selectedOgr}
            setSelectedOgr={setSelectedOgr}
            pushToast={pushToast}
          />
        )}
        {route === 'class' && <ClassCompare pushToast={pushToast} />}
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

// ================== SIDEBAR ==================
function Sidebar({ route, setRoute }) {
  const navs = [
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

      {navs.map((n, i) => n.section ? (
        <div key={i} className="nav-section">{n.section}</div>
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
        <div style={{fontFamily:'Fraunces, serif', fontStyle:'italic', fontSize:13, color:'rgba(245,240,232,0.7)', marginBottom: 6}}>Taner Egehan, 2026</div>
        <div>Ahmet Yesevi Üniversitesi</div>
        <div>Bilgisayar Mühendisliği</div>
        <div>Tezsiz Yüksek Lisans</div>
        <div style={{marginTop: 10, fontFamily:'JetBrains Mono, monospace', fontSize:9}}>build · 2026.05.22</div>
      </div>
    </aside>
  );
}

// ================== OVERVIEW ==================
function Overview({ pushToast }) {
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
        kazanım koduyla eşleyerek hangi konunun hangi öğrencide eksik kaldığını
        gösterir, kural tabanlı bir öneri kümesi üretir.
      </p>

      <div className="kpi-grid">
        <KPI eyebrow="işlevsel doğrulama" label="As2" value="100" unit="%" foot="7/7 test başarılı" tone="up" />
        <KPI eyebrow="uzman ilgililik" label="As3" value="90.4" unit="%" foot="ölçüt %85 — geçildi" tone="up" />
        <KPI eyebrow="ortalama süre" label="As4" value="412" unit="ms" foot="ölçüt &lt; 2000 ms" tone="up" />
        <KPI eyebrow="SUS puanı" label="As5" value="71.7" unit="" foot="ölçüt &gt; 68 — iyi aralık" tone="up" />
      </div>

      <div className="row-3 fade-in delay-2">
        <div className="card" style={{position:'relative'}}>
          <div className="corner-mark">fig · 01</div>
          <div className="card-eyebrow">sınıf 11-A · son sınav</div>
          <div className="card-head">
            <div className="card-title">Kazanım bazlı sınıf başarı yüzdesi</div>
            <span className="tag">12 kazanım</span>
          </div>
          <div style={{marginTop: 12}}>
            {KAZANIMLAR.map((k, i) => {
              const ort = ortalamaKazanim(OGRENCILER.filter(o => o.sube === '11-A'), i);
              const cls = ort < ESIK ? 'crit' : ort < 70 ? 'warn' : 'ok';
              return (
                <div className="bar-row" key={k.kod}>
                  <div className="bar-label">
                    <span className="code">{k.kod}</span>
                    {k.ad}
                  </div>
                  <div className="bar-track">
                    <div className={`bar-fill ${cls}`} style={{width: `${ort}%`}}></div>
                    <div className="bar-threshold" style={{left: `${ESIK}%`}}></div>
                  </div>
                  <div className={`bar-value ${cls === 'crit' ? 'crit' : ''}`}>{ort}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap: 20}}>
          <div className="card">
            <div className="card-eyebrow">sınıf düzeyi</div>
            <div className="card-title">Kritik kazanımlar</div>
            <div style={{marginTop: 18, display:'flex', flexDirection:'column', gap: 14}}>
              {KAZANIMLAR
                .map((k, i) => ({ ...k, ort: ortalamaKazanim(OGRENCILER.filter(o => o.sube==='11-A'), i) }))
                .filter(k => k.ort < ESIK)
                .sort((a,b) => a.ort - b.ort)
                .map(k => (
                  <div key={k.kod} style={{borderLeft:'2px solid var(--terra)', paddingLeft: 12}}>
                    <div style={{fontFamily:'JetBrains Mono', fontSize: 11, color:'var(--muted)'}}>{k.kod}</div>
                    <div style={{fontSize: 13, fontWeight: 500, marginTop: 2}}>{k.ad}</div>
                    <div style={{fontFamily:'JetBrains Mono', fontSize: 11, color:'var(--terra-deep)', marginTop: 4}}>
                      sınıf ort. {k.ort}% · eşiğin {ESIK - k.ort} puan altında
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="card" style={{background:'var(--ink)', color:'var(--cream)', border:'none'}}>
            <div className="card-eyebrow" style={{color:'rgba(245,240,232,0.5)'}}>not</div>
            <div style={{fontFamily:'Fraunces, serif', fontSize: 19, fontStyle:'italic', lineHeight: 1.4, marginBottom: 14}}>
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
              <td>5</td>
              <td className="right mono">410 ms</td>
              <td className="right"><span className="tag ok">başarılı</span></td>
            </tr>
            <tr>
              <td className="mono">22.05 · 13:18</td>
              <td>Sınav çözümleme</td>
              <td>11-B</td>
              <td>2</td>
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
            <tr>
              <td className="mono">21.05 · 10:44</td>
              <td>Sınav çözümleme</td>
              <td>11-A</td>
              <td>5</td>
              <td className="right mono">389 ms</td>
              <td className="right"><span className="tag ok">başarılı</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function KPI({ eyebrow, label, value, unit, foot, tone }) {
  return (
    <div className="kpi fade-in">
      <div className="kpi-label">
        <span style={{color:'var(--terra)'}}>{label}</span> · {eyebrow}
      </div>
      <div className="kpi-value">{value}<span className="unit">{unit}</span></div>
      <div className={`kpi-foot ${tone || ''}`}>{tone === 'up' ? '↗' : '·'} {foot}</div>
    </div>
  );
}

function Upload({ pushToast, setRoute }) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  function runAnalysis() {
    setRunning(true);
    let s = 0;
    const t = setInterval(() => {
      s++;
      setStep(s);
      if (s >= 3) {
        clearInterval(t);
        setTimeout(() => {
          setRunning(false);
          setDone(true);
          pushToast('Çözümleme tamamlandı · 7 öğrenci, 412 ms');
        }, 300);
      }
    }, 700);
  }

  return (
    <>
      <div className="page-meta">
        <span className="meta-tag">/ 02 — Sınav Yükle</span>
        <span className="meta-rule"></span>
        <span className="meta-status">3 adımlı süreç</span>
      </div>
      <h1 className="page-title">Cevap kâğıdını <em>yükleyin</em>.</h1>
      <p className="page-sub">
        CSV, Excel ya da PDF olarak sınav cevap dosyasını sisteme bırakın.
        Sistem, kazanım–soru eşlemesine göre her öğrenci için ayrı bir
        çözümleme üretir.
      </p>

      <div className="steps">
        <div className={`step ${step >= 1 || done ? 'done' : step === 0 && !done ? 'current' : ''}`}>
          <div className="step-num">i.</div>
          <div className="step-label">Dosya seç</div>
        </div>
        <div className={`step ${step >= 2 || done ? 'done' : ''}`}>
          <div className="step-num">ii.</div>
          <div className="step-label">Kazanım eşle</div>
        </div>
        <div className={`step ${step >= 3 || done ? 'done' : ''}`}>
          <div className="step-num">iii.</div>
          <div className="step-label">Çözümle</div>
        </div>
        <div className={`step ${done ? 'done' : ''}`}>
          <div className="step-num">iv.</div>
          <div className="step-label">Rapor görüntüle</div>
        </div>
      </div>

      <div className="upload-zone" onClick={() => { if (!running && !done) pushToast('Demo: cevap_kagidi_11A.csv hazır'); }}>
        <div className="upload-icon">↑</div>
        <div style={{fontFamily:'Fraunces, serif', fontSize:20, marginBottom: 8}}>
          {done ? 'cevap_kagidi_11A.csv' : 'Dosyayı buraya bırakın'}
        </div>
        <div style={{fontSize: 12, color:'var(--muted)', fontFamily:'JetBrains Mono, monospace'}}>
          {done ? '5 öğrenci · 12 kazanım · 40 soru' : '.csv  ·  .xlsx  ·  .pdf'}
        </div>
      </div>

      {!done && (
        <button className="btn" onClick={runAnalysis} disabled={running}>
          {running ? `Çözümleniyor... (adım ${step}/3)` : 'Çözümlemeyi başlat →'}
        </button>
      )}

      {done && (
        <div className="row-2 fade-in" style={{marginTop: 32}}>
          <div className="card">
            <div className="card-eyebrow">özet</div>
            <div className="card-title" style={{marginBottom: 18}}>Çözümleme sonucu</div>
            <div style={{display:'flex', flexDirection:'column', gap: 10}}>
              <Row label="Öğrenci sayısı" value="5" />
              <Row label="Kazanım sayısı" value="12" />
              <Row label="Toplam soru" value="40" />
              <Row label="Sınıf ortalama başarı" value="71.4%" />
              <Row label="Eksik bulunan kazanım sayısı" value="3" highlight />
              <Row label="İşlem süresi" value="412 ms" mono />
            </div>
            <div style={{marginTop: 22, display:'flex', gap: 10}}>
              <button className="btn" onClick={() => setRoute('student')}>Öğrenci raporunu aç →</button>
              <button className="btn ghost" onClick={() => setRoute('class')}>Sınıf karşılaştırma</button>
            </div>
          </div>

          <div className="card">
            <div className="card-eyebrow">kazanım–soru eşleşmesi</div>
            <div className="card-title" style={{marginBottom: 16}}>Sınav blueprint'i</div>
            <table>
              <thead>
                <tr>
                  <th>Kazanım</th>
                  <th>Soru no.</th>
                  <th className="right">Ağırlık</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="mono" style={{fontSize: 11}}>11.1.1.1</td><td>S1, S2, S3</td><td className="right mono">3</td></tr>
                <tr><td className="mono" style={{fontSize: 11}}>11.1.1.2</td><td>S4, S5</td><td className="right mono">2</td></tr>
                <tr><td className="mono" style={{fontSize: 11}}>11.1.1.3</td><td>S6, S7, S8</td><td className="right mono">3</td></tr>
                <tr><td className="mono" style={{fontSize: 11}}>11.2.1.1</td><td>S9, S10</td><td className="right mono">2</td></tr>
                <tr><td className="mono" style={{fontSize: 11}}>11.4.1.1</td><td>S22, S23, S24</td><td className="right mono">3</td></tr>
                <tr><td className="mono" style={{fontSize: 11}}>11.4.2.1</td><td>S25, S26, S27, S28</td><td className="right mono">4</td></tr>
                <tr><td className="mono" style={{fontSize: 11}}>11.4.2.2</td><td>S29, S30, S31</td><td className="right mono">3</td></tr>
              </tbody>
            </table>
            <div style={{fontSize: 11, color:'var(--muted)', marginTop: 12, fontStyle:'italic'}}>
              Tam blueprint için <a style={{color:'var(--terra)'}}>kazanım haritasını</a> görüntüleyin.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, value, highlight, mono }) {
  return (
    <div style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px dashed var(--rule)'}}>
      <span style={{fontSize: 13, color:'var(--ink-soft)'}}>{label}</span>
      <span style={{
        fontFamily: mono ? 'JetBrains Mono, monospace' : 'Fraunces, serif',
        fontSize: mono ? 13 : 17,
        color: highlight ? 'var(--terra-deep)' : 'var(--ink)',
        fontWeight: 500,
      }}>{value}</span>
    </div>
  );
}

// ================== STUDENT ==================
function Student({ selectedOgr, setSelectedOgr, pushToast }) {
  const ogr = OGRENCILER.find(o => o.id === selectedOgr);
  const eksikler = eksikKazanimlar(ogr);
  const genel = genelBasari(ogr);
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <>
      <div className="page-meta">
        <span className="meta-tag">/ 03 — Öğrenci Detayı</span>
        <span className="meta-rule"></span>
        <span className="meta-status">7 öğrenci</span>
      </div>
      <h1 className="page-title">Bireysel <em>çözümleme</em>.</h1>
      <p className="page-sub">
        Her öğrencinin kazanım bazlı başarı dağılımı, eşik altında kalan
        kazanımları ve sistem tarafından önerilen öğrenme kaynakları.
      </p>

      <div className="student-grid">
        {OGRENCILER.map(o => (
          <div
            key={o.id}
            className={`student-card ${o.id === selectedOgr ? 'selected' : ''}`}
            onClick={() => setSelectedOgr(o.id)}
          >
            <div className="student-name">{o.ad}</div>
            <div className="student-meta">
              <span>{o.id}</span>
              <span>{genelBasari(o)}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="row-3">
        <div>
          <div className="card" style={{marginBottom: 20}}>
            <div className="card-head">
              <div>
                <div className="card-eyebrow">öğrenci raporu</div>
                <div className="card-title">{ogr.ad} <span style={{color:'var(--muted)', fontFamily:'JetBrains Mono', fontSize:13, fontWeight:400, marginLeft:8}}>· {ogr.id} · {ogr.sube}</span></div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontFamily:'Fraunces, serif', fontSize: 48, lineHeight: 1, color:'var(--ink)'}}>{genel}<span style={{fontSize: 20, color:'var(--muted)'}}>%</span></div>
                <div style={{fontSize: 10, color:'var(--muted)', fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.1em', textTransform:'uppercase'}}>genel başarı</div>
              </div>
            </div>

            <div style={{marginTop: 20}}>
              {KAZANIMLAR.map((k, i) => {
                const y = ogr.kazanimlar[i];
                const cls = y < ESIK ? 'crit' : y < 70 ? 'warn' : 'ok';
                return (
                  <div className="bar-row" key={k.kod}>
                    <div className="bar-label">
                      <span className="code">{k.kod} · {k.dal}</span>
                      {k.ad}
                    </div>
                    <div className="bar-track">
                      <div className={`bar-fill ${cls}`} style={{width: `${y}%`}}></div>
                      <div className="bar-threshold" style={{left: `${ESIK}%`}}></div>
                    </div>
                    <div className={`bar-value ${cls === 'crit' ? 'crit' : ''}`}>{y}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">Öğrenme profili</div>
              <span className="tag">5 alan</span>
            </div>
            <div style={{height: 280}}>
              <ResponsiveContainer>
                <RadarChart data={
                  ['Trigonometri','Üstel-Logaritmik','Diziler','Türev','Olasılık'].map(dal => {
                    const ks = KAZANIMLAR.map((k, i) => ({...k, y: ogr.kazanimlar[i]})).filter(k => k.dal === dal);
                    const ort = ks.reduce((s,k) => s+k.y, 0) / ks.length;
                    return { dal, yuzde: Math.round(ort) };
                  })
                }>
                  <PolarGrid stroke="#d8cfbd" />
                  <PolarAngleAxis dataKey="dal" tick={{fill:'#4a5468', fontSize:11, fontFamily:'Manrope'}} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{fill:'#8a8478', fontSize:10}} />
                  <Radar name={ogr.ad} dataKey="yuzde" stroke="#b8533a" fill="#b8533a" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap: 20}}>
          <div className="card">
            <div className="card-eyebrow">eşik altı kazanım</div>
            <div className="card-title">Eksik kazanımlar <span style={{color:'var(--terra)', fontFamily:'Fraunces', fontStyle:'italic', fontWeight:300}}>· {eksikler.length}</span></div>

            {eksikler.length === 0 ? (
              <div style={{padding: 24, textAlign:'center', color:'var(--moss-deep)', fontStyle:'italic', fontFamily:'Fraunces, serif'}}>
                Tüm kazanımlar eşik üzerinde.
              </div>
            ) : (
              <div style={{marginTop: 16, display:'flex', flexDirection:'column', gap: 14}}>
                {eksikler.map(k => (
                  <div key={k.kod} style={{borderLeft:'2px solid var(--terra)', paddingLeft: 12, paddingBottom: 8}}>
                    <div style={{fontFamily:'JetBrains Mono', fontSize: 10, color:'var(--muted)', letterSpacing:'0.05em'}}>{k.kod}</div>
                    <div style={{fontSize: 13, fontWeight: 500, marginTop: 2}}>{k.ad}</div>
                    <div style={{fontFamily:'JetBrains Mono', fontSize: 11, color:'var(--terra-deep)', marginTop: 4}}>
                      {k.yuzde}% — {ESIK - k.yuzde} puan eksik
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="btn" style={{marginTop: 20, width:'100%'}} onClick={() => setShowFeedback(true)}>
              Geri bildirim metnini görüntüle →
            </button>
          </div>

          {eksikler[0] && ONERILER[eksikler[0].kod] && (
            <div className="card">
              <div className="card-eyebrow">öncelikli kazanım için</div>
              <div className="card-title">Önerilen kaynaklar</div>
              <div style={{fontFamily:'JetBrains Mono, monospace', fontSize: 11, color:'var(--muted)', marginTop: 6}}>
                {eksikler[0].kod} · {eksikler[0].ad}
              </div>
              <div className="suggest-list">
                {ONERILER[eksikler[0].kod].map((s, i) => (
                  <div className="suggest-item" key={i}>
                    <span className="suggest-rank">i{['', 'i', 'ii'][i] || ''}.</span>
                    <div className="suggest-body">
                      <div className="suggest-title">{s.ad}</div>
                      <div className="suggest-meta">{s.tur}</div>
                    </div>
                    <span className="suggest-duration">{s.sure} dk</span>
                    <button className="btn ghost" style={{padding:'6px 12px', fontSize: 11}} onClick={() => pushToast(`Açılıyor: ${s.ad}`)}>aç</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showFeedback && (
        <div className="modal-overlay" onClick={() => setShowFeedback(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowFeedback(false)}>×</button>
            <div className="card-eyebrow">öğrenciye yönelik geri bildirim · otomatik üretildi</div>
            <h2 style={{fontFamily:'Fraunces, serif', fontSize: 28, fontWeight: 500, marginBottom: 24, letterSpacing:'-0.01em'}}>
              {ogr.ad} için kişisel rapor
            </h2>
            <div className="feedback-card">
              <div className="fb-greeting">Merhaba {ogr.ad.split(' ')[0]},</div>
              <div className="fb-text drop-cap">
                Son sınavda toplam <strong>%{genel}</strong> oranında başarı gösterdin.
                Bu rapor, hangi konuları iyi kavradığını ve hangi noktalarda
                ek çalışmaya ihtiyaç duyduğunu göstermek için hazırlandı.
              </div>
              {eksikler.length > 0 && (
                <div className="fb-text">
                  <strong>Üzerinde çalışmanın yararlı olacağı kazanımlar:</strong>
                  <div style={{marginTop: 10, lineHeight: 2}}>
                    {eksikler.map(k => (
                      <span key={k.kod} className="gap-pill">{k.kod} · {k.yuzde}%</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="fb-text">
                Özellikle <strong>{eksikler[0]?.ad || 'türev uygulamaları'}</strong> başlığında soruların
                yarısından azını çözebildiğin görülüyor. Aşağıdaki kaynaklar bu
                kazanımı pekiştirmek için seçildi; sırasıyla izlemen önerilir:
              </div>
              {ONERILER[eksikler[0]?.kod] && (
                <ul style={{listStyle:'none', padding:0, margin:'12px 0 0', fontSize: 14, lineHeight: 2}}>
                  {ONERILER[eksikler[0].kod].map((s, i) => (
                    <li key={i} style={{paddingLeft: 24, position:'relative'}}>
                      <span style={{position:'absolute', left:0, color:'var(--terra)', fontStyle:'italic', fontFamily:'Fraunces'}}>{i+1}.</span>
                      <strong>{s.ad}</strong> <span style={{color:'var(--muted)'}}>· {s.tur} · {s.sure} dakika</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="fb-text" style={{marginTop: 20, fontStyle:'italic', color:'var(--ink-soft)'}}>
                İyi çalışmalar dileriz.
              </div>
            </div>
            <div style={{display:'flex', gap: 10, marginTop: 24}}>
              <button className="btn" onClick={() => pushToast('PDF olarak dışa aktarıldı')}>PDF olarak indir</button>
              <button className="btn ghost" onClick={() => pushToast('E-postaya kuyruğa alındı')}>Veliye e-posta gönder</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ================== CLASS COMPARE ==================
function ClassCompare({ pushToast }) {
  const [showAll, setShowAll] = useState(false);

  const data = KAZANIMLAR.map((k, i) => ({
    kod: k.kod.split('.').slice(-1)[0],
    ad: k.ad.substring(0, 24) + (k.ad.length > 24 ? '…' : ''),
    fullAd: k.ad,
    '11-A': ortalamaKazanim(OGRENCILER.filter(o => o.sube === '11-A'), i),
    '11-B': ortalamaKazanim(OGRENCILER.filter(o => o.sube === '11-B'), i),
  }));

  // Performance data — mock O(n) timing
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
            <span className="tag dot" style={{color:'var(--terra)'}}>11-A</span>
            <span className="tag dot" style={{color:'var(--moss-deep)'}}>11-B</span>
          </div>
        </div>
        <div style={{height: 380, marginTop: 16}}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{top: 20, right: 16, left: -10, bottom: 60}}>
              <CartesianGrid stroke="#d8cfbd" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="kod"
                tick={{fontSize: 10, fontFamily:'JetBrains Mono', fill:'#8a8478'}}
                axisLine={{stroke: '#d8cfbd'}}
              />
              <YAxis
                domain={[0, 100]}
                tick={{fontSize: 10, fill:'#8a8478'}}
                axisLine={{stroke: '#d8cfbd'}}
              />
              <Tooltip
                contentStyle={{background:'#1a1f2e', border:'none', color:'#f5f0e8', fontSize: 12, fontFamily:'Manrope'}}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullAd || label}
              />
              <ReferenceLine y={ESIK} stroke="#b8533a" strokeDasharray="5 5" label={{value:'eşik %50', position:'right', fill:'#b8533a', fontSize: 10}} />
              <Bar dataKey="11-A" fill="#b8533a" />
              <Bar dataKey="11-B" fill="#5e7a4a" />
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
                <CartesianGrid stroke="#d8cfbd" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="n" tick={{fontSize: 10, fontFamily:'JetBrains Mono', fill:'#8a8478'}} label={{value:'öğrenci sayısı', position:'insideBottom', offset:-5, fontSize: 10, fill:'#8a8478'}} />
                <YAxis tick={{fontSize: 10, fill:'#8a8478'}} label={{value:'ms', angle:-90, position:'insideLeft', fontSize: 10, fill:'#8a8478'}} />
                <Tooltip contentStyle={{background:'#1a1f2e', border:'none', color:'#f5f0e8', fontSize: 12}} />
                <ReferenceLine y={2000} stroke="#a83b2a" strokeDasharray="4 4" label={{value:'ölçüt 2sn', position:'right', fill:'#a83b2a', fontSize: 10}} />
                <Line type="monotone" dataKey="ms" stroke="#1a1f2e" strokeWidth={2} dot={{fill:'#b8533a', r: 3}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', marginTop: 14, paddingTop: 14, borderTop:'1px solid var(--rule)'}}>
            <div>
              <div style={{fontSize: 10, color:'var(--muted)', fontFamily:'JetBrains Mono', textTransform:'uppercase', letterSpacing:'0.1em'}}>ort. süre</div>
              <div style={{fontFamily:'Fraunces, serif', fontSize: 24, color:'var(--ink)'}}>412<span style={{color:'var(--muted)', fontSize: 14}}> ms</span></div>
            </div>
            <div>
              <div style={{fontSize: 10, color:'var(--muted)', fontFamily:'JetBrains Mono', textTransform:'uppercase', letterSpacing:'0.1em'}}>p95</div>
              <div style={{fontFamily:'Fraunces, serif', fontSize: 24, color:'var(--ink)'}}>987<span style={{color:'var(--muted)', fontSize: 14}}> ms</span></div>
            </div>
            <div>
              <div style={{fontSize: 10, color:'var(--muted)', fontFamily:'JetBrains Mono', textTransform:'uppercase', letterSpacing:'0.1em'}}>çalıştırma</div>
              <div style={{fontFamily:'Fraunces, serif', fontSize: 24, color:'var(--ink)'}}>123</div>
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
                .map(d => ({ ...d, fark: d['11-B'] - d['11-A'] }))
                .sort((a, b) => Math.abs(b.fark) - Math.abs(a.fark))
                .slice(0, 6)
                .map(d => (
                  <tr key={d.kod}>
                    <td>{d.fullAd}</td>
                    <td className="right mono">{d['11-A']}%</td>
                    <td className="right mono">{d['11-B']}%</td>
                    <td className="right mono" style={{color: d.fark > 0 ? 'var(--moss-deep)' : 'var(--terra-deep)', fontWeight: 600}}>
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

// ================== EXPERT PANEL ==================
function ExpertPanel({ pushToast }) {
  const sorular = [
    'Her kazanımdaki başarı yüzdesinin öğrenci düzeyinde ayrı ayrı gösterilmesi gereklidir.',
    'Sınıf düzeyinde kazanım bazlı karşılaştırma çıktısı dönem içi planlama için yararlıdır.',
    'Geri bildirim metninde hangi kazanımın hangi soruda eksik kaldığı açıkça gösterilmelidir.',
    'Eksik kazanımlar için sistem tarafından sunulan ek soru önerileri öğretim sürecini destekler.',
    'Geri bildirim metni, öğrencinin doğrudan okuyup anlayabileceği biçimde yazılmalıdır.',
    'Sistemin ürettiği rapor yazdırılabilir ya da PDF olarak dışa aktarılabilir olmalıdır.',
    'Kazanım–soru eşlemesi öğretmen tarafından gözden geçirilebilir olmalıdır.',
    'Eşik tabanlı eksik kazanım listesi, sınıf içi tekrar planı için kullanılabilir.',
  ];

  const [puanlar, setPuanlar] = useState(Array(sorular.length).fill(null));

  function setPuan(idx, val) {
    const yeni = [...puanlar];
    yeni[idx] = val;
    setPuanlar(yeni);
  }

  const cevaplanan = puanlar.filter(p => p !== null).length;
  const ort = cevaplanan > 0
    ? (puanlar.filter(p => p !== null).reduce((s, p) => s + p, 0) / cevaplanan).toFixed(2)
    : '—';

  // Mock uzman puanları
  const mockUzmanlar = [
    { ad: 'U1', deneyim: '14 yıl', puanlar: [5, 5, 5, 5, 4, 5, 4, 5] },
    { ad: 'U2', deneyim: '9 yıl', puanlar: [5, 4, 5, 4, 5, 5, 5, 5] },
    { ad: 'U3', deneyim: '22 yıl', puanlar: [4, 5, 5, 4, 5, 4, 4, 5] },
  ];

  return (
    <>
      <div className="page-meta">
        <span className="meta-tag">/ 05 — Uzman Paneli</span>
        <span className="meta-rule"></span>
        <span className="meta-status">3 uzman değerlendirmesi</span>
      </div>
      <h1 className="page-title">Uzman <em>görüş formu</em>.</h1>
      <p className="page-sub">
        Üç matematik öğretmeninden alınan görüşler, sistemin işlevsel gereksinim
        setini ve öneri çıktılarının kalitesini değerlendirmek için kullanılır.
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
                <div key={n} style={{width: 32, textAlign:'center', fontFamily:'JetBrains Mono', fontSize: 11, color:'var(--muted)'}}>{n}</div>
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
            marginTop: 24, padding: 18, background: 'var(--cream-2)',
            display:'flex', justifyContent:'space-between', alignItems:'center'
          }}>
            <div>
              <div style={{fontSize: 11, color:'var(--ink-soft)', fontFamily:'JetBrains Mono'}}>oturum ortalaması</div>
              <div style={{fontFamily:'Fraunces, serif', fontSize: 32, color:'var(--ink)'}}>{ort}</div>
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
                {sorular.slice(0, 8).map((s, i) => {
                  const vals = mockUzmanlar.map(u => u.puanlar[i]).sort((a,b)=>a-b);
                  const med = vals[1];
                  return (
                    <tr key={i}>
                      <td style={{fontSize: 12}}>{i+1}. {s.substring(0, 45)}…</td>
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
            <div className="card-eyebrow">öneri ilgililik çalışması</div>
            <div className="card-title">Uzman değerlendirme özeti</div>
            <div style={{marginTop: 18, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16}}>
              <div style={{padding: 18, background:'var(--cream-2)'}}>
                <div style={{fontSize: 11, color:'var(--muted)', fontFamily:'JetBrains Mono', textTransform:'uppercase', letterSpacing:'0.1em'}}>ilgili öneri</div>
                <div style={{fontFamily:'Fraunces, serif', fontSize: 36, color:'var(--ink)'}}>198<span style={{fontSize: 16, color:'var(--muted)'}}> / 219</span></div>
                <div style={{fontSize: 11, color:'var(--moss-deep)', marginTop: 4, fontFamily:'JetBrains Mono'}}>%90.4 ✓ ölçüt %85</div>
              </div>
              <div style={{padding: 18, background:'var(--cream-2)'}}>
                <div style={{fontSize: 11, color:'var(--muted)', fontFamily:'JetBrains Mono', textTransform:'uppercase', letterSpacing:'0.1em'}}>kapsanan kaz.</div>
                <div style={{fontFamily:'Fraunces, serif', fontSize: 36, color:'var(--ink)'}}>12<span style={{fontSize: 16, color:'var(--muted)'}}> / 12</span></div>
                <div style={{fontSize: 11, color:'var(--moss-deep)', marginTop: 4, fontFamily:'JetBrains Mono'}}>tam kapsama</div>
              </div>
            </div>

            <div style={{marginTop: 16}}>
              <div style={{fontSize: 12, color:'var(--ink-soft)', marginBottom: 10}}>Uzman bazlı dağılım:</div>
              {mockUzmanlar.map(u => {
                const ilgili = [68, 67, 63][mockUzmanlar.indexOf(u)];
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
        <div className="card" style={{background:'var(--cream-2)'}}>
          <div className="card-eyebrow">U1 · 14 yıl deneyim</div>
          <div style={{fontFamily:'Fraunces, serif', fontSize: 17, fontStyle:'italic', lineHeight: 1.5, color:'var(--ink-2)'}}>
            "Sistemin sınıf düzeyinde sunduğu karşılaştırma çıktısı, dönem içi
            zümre toplantılarında doğrudan kullanılabilecek nitelikte. Özellikle
            kazanım–şube–dönem üçlüsünün tek bir özet tabloda izlenebilmesi
            önerime alınmalı."
          </div>
        </div>
        <div className="card" style={{background:'var(--cream-2)'}}>
          <div className="card-eyebrow">U3 · 22 yıl deneyim</div>
          <div style={{fontFamily:'Fraunces, serif', fontSize: 17, fontStyle:'italic', lineHeight: 1.5, color:'var(--ink-2)'}}>
            "Türev uygulamaları ve toplam-fark formülleri için sunulan
            öneri havuzu biraz dar kalmış. Aynı kazanım için en az iki
            örnek çözüm ve bir kademeli alıştırma seti olmasını beklerdim."
          </div>
        </div>
      </div>
    </>
  );
}

// ================== CURRICULUM (KAZANIM KATALOĞU) ==================
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

  // Bölüm (11.x) bazında grupla
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
        (2018) gerçek kod ve metinleriyle alınmıştır.
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
                  <th style={{width: 220}}>Konu</th>
                </tr>
              </thead>
              <tbody>
                {list.map(k => (
                  <tr key={k.kod}>
                    <td className="mono" style={{color:'var(--accent)', fontWeight: 500, whiteSpace:'nowrap'}}>{k.kod}</td>
                    <td style={{color:'var(--ink)'}}>{k.ad}</td>
                    <td style={{color:'var(--ink-soft)', fontSize: 12}}>{k.konu}</td>
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

// ================== ABOUT ==================
function About() {
  return (
    <>
      <div className="page-meta">
        <span className="meta-tag">/ 06 — Proje Hakkında</span>
        <span className="meta-rule"></span>
        <span className="meta-status">prototip · sürüm 1.0</span>
      </div>
      <h1 className="page-title">Bu prototip <em>nedir</em>?</h1>
      <p className="page-sub">
        Ahmet Yesevi Üniversitesi Bilgisayar Mühendisliği Tezsiz Yüksek Lisans
        programı kapsamında, "Kazanım Bazlı Sınav Çözümleme ve Geri Bildirim
        Sistemi Prototipi: 11. Sınıf Matematik Örneği" başlıklı dönem
        projesinin yazılım çıktısıdır.
      </p>

      <div className="row-2">
        <div className="card">
          <div className="card-eyebrow">amaç</div>
          <div className="card-title">Proje amacı</div>
          <p style={{marginTop: 14, lineHeight: 1.65, fontSize: 14, color:'var(--ink-2)'}}>
            11. sınıf matematik dersi için, sınav çıktılarını öğrenme
            kazanımlarına göre çözümleyen, eksik kazanımları eşik tabanlı
            tespit eden ve kural tabanlı bir öneri kümesi üreten yerel
            çalışan bir prototip geliştirmek; prototipin işlevsel doğruluğunu,
            öneri kalitesini, performansını ve kullanılabilirliğini
            uzman görüşüne ve ön kullanıcı testine dayanarak değerlendirmek.
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
              'Görev başarısı %80+ ve SUS &gt; 68 ölçütleri sağlanıyor mu?',
            ].map((q, i) => (
              <li key={i} style={{
                padding:'10px 0', borderBottom:'1px solid var(--rule)',
                fontSize: 13, color:'var(--ink-2)', display:'flex', gap: 14,
              }}>
                <span style={{fontFamily:'Fraunces, serif', fontStyle:'italic', color:'var(--terra)', fontSize: 18, width: 24}}>{['i', 'ii', 'iii', 'iv', 'v'][i]}.</span>
                <span>{q}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="divider-x">
        <span className="divider-label">teknik künye</span>
      </div>

      <div className="kpi-grid">
        <KPI eyebrow="işleme" label="•" value="Yerel" unit="" foot="bulut bağımsız" tone="" />
        <KPI eyebrow="öneri yaklaşımı" label="•" value="Kural" unit="tabanlı" foot="şeffaf hesaplama" tone="" />
        <KPI eyebrow="müfredat" label="•" value="MEB" unit="11.sınıf" foot="2018 programı" tone="" />
        <KPI eyebrow="ders kapsamı" label="•" value="12" unit="kazanım" foot="matematik" tone="" />
      </div>

      <div className="card" style={{marginTop: 20, background:'var(--ink)', color:'var(--cream)', border:'none', padding: 40}}>
        <div className="card-eyebrow" style={{color:'rgba(245,240,232,0.5)'}}>kavramsal çerçeve</div>
        <div style={{fontFamily:'Fraunces, serif', fontSize: 26, fontWeight: 400, fontStyle:'italic', lineHeight: 1.4, marginTop: 12, color:'var(--cream)'}}>
          "Etkili bir geri bildirim üç soruyu yanıtlar:<br/>
          <em style={{color:'var(--ochre)'}}>Nereye gidiyorum?</em>
          <em style={{color:'var(--terra)'}}> · Şu an neredeyim? </em>
          <em style={{color:'var(--moss)'}}>· Sonra nereye?</em>"
        </div>
        <div style={{fontSize: 12, color:'rgba(245,240,232,0.5)', marginTop: 18, fontFamily:'JetBrains Mono'}}>
          Hattie &amp; Timperley, 2007, Review of Educational Research
        </div>
      </div>
    </>
  );
}

export default App;
