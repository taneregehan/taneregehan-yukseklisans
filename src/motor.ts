// Çözümleme ve öneri motoru.
// Tez Bölüm 3.8 ve 3.9'da tanımlanan algoritmaların doğrudan uygulamasıdır.

import { KAZANIMLAR_11, KAZANIM_INDEKS, type Kazanim } from './kazanimlar';
import { SORU_BANKASI, SORU_INDEKS, type Soru } from './soruBankasi';
import type { Ogrenci, OgrenciYanit } from './ogrenciler';

// --- Sabitler (tezde belirtilmiştir) -----------------------------------------

/** Eksik kazanım eşik değeri (Bölüm 3.8) */
export const ESIK = 0.6;

/** Öneri skor fonksiyonu ağırlıkları (Bölüm 3.9) */
export const ONERI_AGIRLIK = { w1: 0.5, w2: 0.3, w3: 0.2 } as const;

/** Varsayılan öneri listesi uzunluğu (Bölüm 3.9, N=5) */
export const ONERI_N = 5;

/** Tekrar önleme penceresi — son N gün (Kural 3) */
export const TEKRAR_PENCERESI_GUN = 30;

/** Çeşitlilik kuralı eşiği — bir kaynaktan en fazla %X (Kural 4) */
export const CESITLILIK_TAVAN = 0.4;

// --- Kritiklik sınıflandırma -------------------------------------------------

export type KritiklikSinifi = 'yuksek' | 'orta' | 'dusuk';

export function kritiklikSinifi(kritiklik: number): KritiklikSinifi {
  // Tablo 3.4
  if (kritiklik >= 0.4) return 'yuksek';
  if (kritiklik >= 0.2) return 'orta';
  return 'dusuk';
}

export const KRITIKLIK_ETIKETLERI: Record<KritiklikSinifi, { etiket: string; renkSinifi: string }> = {
  yuksek: { etiket: 'Yüksek kritiklik', renkSinifi: 'crit' },
  orta:   { etiket: 'Orta kritiklik',   renkSinifi: 'warn' },
  dusuk:  { etiket: 'Düşük kritiklik',  renkSinifi: 'ok' },
};

// --- Kazanım başarı hesaplaması ---------------------------------------------

export type KazanimBasari = {
  kazanim: Kazanim;
  dogru: number;        // doğru cevap sayısı
  toplam: number;       // ilgili kazanıma ait soru sayısı
  basari: number;       // 0..1
  basariYuzde: number;  // 0..100 (yuvarlanmış)
  eksik: boolean;
  kritiklik: number;
  sinif: KritiklikSinifi | null;
  oncekiYuzde?: number;
  delta?: number;       // bu sınav − önceki sınav (yuzde puan)
};

/**
 * Tek bir öğrenci için kazanım başarı oranlarını hesaplar.
 * Bölüm 3.8: başarı(k) = doğru_yanıt_sayısı(k) / toplam_soru_sayısı(k)
 * kritiklik(k) = (eşik − başarı(k)) × kazanım_ağırlığı(k)  (sadece eksiklerde)
 */
export function basariOranlariniHesapla(ogr: Ogrenci): KazanimBasari[] {
  const gruplama = new Map<string, { dogru: number; toplam: number }>();
  for (const y of ogr.yanitlar) {
    const soru = SORU_INDEKS[y.soruId];
    if (!soru) continue;
    const k = soru.kazanimKod;
    if (!gruplama.has(k)) gruplama.set(k, { dogru: 0, toplam: 0 });
    const g = gruplama.get(k)!;
    g.toplam += 1;
    if (y.dogru) g.dogru += 1;
  }

  const sonuc: KazanimBasari[] = [];
  for (const k of KAZANIMLAR_11) {
    const g = gruplama.get(k.kod);
    if (!g || g.toplam === 0) continue; // sınavda kapsanmamış kazanımlar atlanır
    const basari = g.dogru / g.toplam;
    const eksik = basari < ESIK;
    const kritiklik = eksik ? (ESIK - basari) * k.agirlik : 0;
    const sinif = eksik ? kritiklikSinifi(kritiklik) : null;
    const oncekiYuzde = ogr.oncekiKazanimBasari[k.kod];
    const basariYuzde = Math.round(basari * 100);
    sonuc.push({
      kazanim: k,
      dogru: g.dogru,
      toplam: g.toplam,
      basari,
      basariYuzde,
      eksik,
      kritiklik,
      sinif,
      oncekiYuzde,
      delta: oncekiYuzde !== undefined ? basariYuzde - oncekiYuzde : undefined,
    });
  }
  return sonuc;
}

/** Eksik kazanımları kritikliğe göre azalan sırada döndürür. */
export function eksikKazanimlariSirala(basarilar: KazanimBasari[]): KazanimBasari[] {
  return basarilar
    .filter(b => b.eksik)
    .sort((a, b) => b.kritiklik - a.kritiklik);
}

// --- 4 kurallı öneri motoru -------------------------------------------------

export type KuralIzi = {
  ilgililik: boolean;
  zorlukUyumu: boolean;
  tekrarOnleme: boolean;
  cesitlilik: boolean;
};

export type OneriSorusu = {
  soru: Soru;
  ilgililik: number;       // 0..1
  zorlukUyumu: number;     // 0..1
  cesitlilik: number;      // 0..1 — kaynağın listedeki payına göre tersine orantılı
  skor: number;
  kuralIzi: KuralIzi;
  aciklama: string;
};

export type OneriListesi = {
  kazanim: Kazanim;
  basari: KazanimBasari;
  oneriler: OneriSorusu[];
};

export type OneriOpsiyonlari = {
  tekrarOnleme: boolean;  // Kural 3 etkin mi?
  N?: number;
};

/**
 * Bir eksik kazanım için zorluk uyumu skoru.
 * Bölüm 3.9 — Kural 2: yüksek kritiklik (≥0.40) ise 2–3 düzeyi tercih;
 * orta/düşükte 3–4; düşük kritiklikte (<0.20) ise 4–5 tercih.
 */
function zorlukUyumSkoru(sinif: KritiklikSinifi, zorluk: number): number {
  if (sinif === 'yuksek') {
    // 2 ve 3 ideal; 1 ve 4 yarı; 5 düşük.
    if (zorluk === 2 || zorluk === 3) return 1.0;
    if (zorluk === 1 || zorluk === 4) return 0.5;
    return 0.2;
  }
  if (sinif === 'orta') {
    if (zorluk === 3 || zorluk === 4) return 1.0;
    if (zorluk === 2 || zorluk === 5) return 0.5;
    return 0.2;
  }
  // 'dusuk' — daha zor sorular önerilir (4–5)
  if (zorluk === 4 || zorluk === 5) return 1.0;
  if (zorluk === 3) return 0.5;
  return 0.2;
}

/**
 * Tek bir eksik kazanım için öneri listesi üretir.
 * Bölüm 3.9 — Kural 1..4 + ağırlıklı skor + ilk N.
 */
export function bircazanimIcinOneri(
  basari: KazanimBasari,
  ogr: Ogrenci,
  opsiyonlar: OneriOpsiyonlari = { tekrarOnleme: true, N: ONERI_N }
): OneriSorusu[] {
  const N = opsiyonlar.N ?? ONERI_N;

  // KURAL 1 — İlgililik: sadece bu kazanıma bağlı sorular
  let havuz: Soru[] = SORU_BANKASI.filter(s => s.kazanimKod === basari.kazanim.kod);

  // KURAL 3 — Tekrar önleme (opsiyonel)
  if (opsiyonlar.tekrarOnleme) {
    const cozulen = new Set(ogr.son30GunCozulen);
    havuz = havuz.filter(s => !cozulen.has(s.id));
  }

  if (havuz.length === 0) return [];

  // Adayları skorla — Kural 2 ve geçici çeşitlilik skoru
  const sinif = basari.sinif ?? 'dusuk';
  const adaylar: OneriSorusu[] = havuz.map(s => {
    const ilgililik = 1.0; // Kural 1 zaten filtrelediği için tam
    const zorlukUyumu = zorlukUyumSkoru(sinif, s.zorluk);
    return {
      soru: s,
      ilgililik,
      zorlukUyumu,
      cesitlilik: 0, // aşağıda hesaplanacak
      skor: 0,
      kuralIzi: {
        ilgililik: true,
        zorlukUyumu: zorlukUyumu >= 0.5,
        tekrarOnleme: opsiyonlar.tekrarOnleme,
        cesitlilik: true, // aşağıda gerçekleşince netleştirilecek
      },
      aciklama: '',
    };
  });

  // Ön sıralama: ilgililik + zorluk uyumu yüksek olanlar baş tarafa
  adaylar.sort((a, b) => (
    (b.ilgililik * ONERI_AGIRLIK.w1 + b.zorlukUyumu * ONERI_AGIRLIK.w2)
    - (a.ilgililik * ONERI_AGIRLIK.w1 + a.zorlukUyumu * ONERI_AGIRLIK.w2)
  ));

  // KURAL 4 — Çeşitlilik: tek kaynaktan en fazla %CESITLILIK_TAVAN
  const kaynakSayilari = new Map<string, number>();
  const seciliKaynakTavan = Math.max(1, Math.floor(N * CESITLILIK_TAVAN));
  const seciliTurTavan = Math.max(2, Math.ceil(N * 0.6)); // tek türde en fazla %60
  const turSayilari = new Map<string, number>();

  const secilenler: OneriSorusu[] = [];
  for (const aday of adaylar) {
    if (secilenler.length >= N) break;
    const kayCount = kaynakSayilari.get(aday.soru.kaynak) ?? 0;
    const turCount = turSayilari.get(aday.soru.tur) ?? 0;
    if (kayCount >= seciliKaynakTavan) continue;
    if (turCount >= seciliTurTavan) continue;
    kaynakSayilari.set(aday.soru.kaynak, kayCount + 1);
    turSayilari.set(aday.soru.tur, turCount + 1);
    secilenler.push(aday);
  }

  // Kaynak tavanı yüzünden N'e ulaşamadıysak, çeşitlilik kuralını gevşeterek tamamla
  if (secilenler.length < N) {
    for (const aday of adaylar) {
      if (secilenler.length >= N) break;
      if (secilenler.includes(aday)) continue;
      secilenler.push({ ...aday, kuralIzi: { ...aday.kuralIzi, cesitlilik: false } });
    }
  }

  // Son skor hesabı — çeşitlilik = 1 − (aynı kaynağın listedeki oranı)
  const finalKaynakSayilari = new Map<string, number>();
  for (const s of secilenler) {
    finalKaynakSayilari.set(s.soru.kaynak, (finalKaynakSayilari.get(s.soru.kaynak) ?? 0) + 1);
  }

  const sonListe: OneriSorusu[] = secilenler.map(s => {
    const kaynakPay = (finalKaynakSayilari.get(s.soru.kaynak) ?? 1) / secilenler.length;
    const cesitlilikSkoru = Math.max(0, 1 - kaynakPay);
    const skor =
      s.ilgililik * ONERI_AGIRLIK.w1 +
      s.zorlukUyumu * ONERI_AGIRLIK.w2 +
      cesitlilikSkoru * ONERI_AGIRLIK.w3;
    return {
      ...s,
      cesitlilik: cesitlilikSkoru,
      skor,
      aciklama: buildAciklama(basari.kazanim, s.soru, sinif, cesitlilikSkoru),
    };
  });

  sonListe.sort((a, b) => b.skor - a.skor);
  return sonListe;
}

function buildAciklama(k: Kazanim, s: Soru, sinif: KritiklikSinifi, cs: number): string {
  const sinifA = sinif === 'yuksek' ? 'yüksek' : sinif === 'orta' ? 'orta' : 'düşük';
  const zorlukOnerisi =
    sinif === 'yuksek' ? 'orta zorluk (2–3)' :
    sinif === 'orta'   ? 'orta-yüksek zorluk (3–4)' :
                          'yüksek zorluk (4–5)';
  return `${k.kod} kazanımında eksiklik kritikliği ${sinifA}. Tezde tanımlı `
    + `zorluk uyum kuralı bu düzey için ${zorlukOnerisi} önerir; bu soru zorluk ${s.zorluk}. `
    + `Çeşitlilik skoru ${cs.toFixed(2)} (${s.kaynak}, ${s.tur}).`;
}

/** Tüm eksik kazanımlar için öneri listeleri üretir. */
export function oneriUret(
  ogr: Ogrenci,
  basarilar: KazanimBasari[],
  opsiyonlar: OneriOpsiyonlari = { tekrarOnleme: true, N: ONERI_N }
): OneriListesi[] {
  const eksikler = eksikKazanimlariSirala(basarilar);
  return eksikler.map(b => ({
    kazanim: b.kazanim,
    basari: b,
    oneriler: bircazanimIcinOneri(b, ogr, opsiyonlar),
  }));
}

// --- Konu (bölüm) hiyerarşisi yardımcıları ----------------------------------

export type KonuGrubu = {
  bolum: string;
  alan: string;
  kazanimlar: KazanimBasari[];
};

/** Kazanım başarılarını MEB bölümüne (11.x) göre gruplar. */
export function bolumlereGore(basarilar: KazanimBasari[]): KonuGrubu[] {
  const harita = new Map<string, KonuGrubu>();
  for (const b of basarilar) {
    const k = b.kazanim;
    if (!harita.has(k.bolum)) {
      harita.set(k.bolum, { bolum: k.bolum, alan: k.alan, kazanimlar: [] });
    }
    harita.get(k.bolum)!.kazanimlar.push(b);
  }
  return Array.from(harita.values());
}

// --- Doğrulama yardımcıları --------------------------------------------------

/** İşlevsel doğrulama T1 — kazanım başarı oranı %100 doğrulukla hesaplanıyor mu? */
export function dogrulaT1(): boolean {
  // küçük bir senaryo: 3 soruluk bir kazanımda 2 doğru → %66.66 başarı
  const test: Ogrenci = {
    id: 'TEST', ad: 'TEST', sube: '-',
    son30GunCozulen: [],
    oncekiKazanimBasari: {},
    yanitlar: [
      { soruId: 'S-11.1.1.1-01', dogru: true },
      { soruId: 'S-11.1.1.1-02', dogru: true },
      { soruId: 'S-11.1.1.1-03', dogru: false },
    ],
  };
  const r = basariOranlariniHesapla(test);
  const k = r.find(x => x.kazanim.kod === '11.1.1.1');
  if (!k) return false;
  return Math.abs(k.basari - 2 / 3) < 1e-9;
}

// Tip yardımcıları
export type { Soru, Kazanim, OgrenciYanit, Ogrenci };
export { KAZANIM_INDEKS };
