// Örnek (mock) öğrenci profilleri ve sınav yanıtları.
// Tezde belirtildiği gibi üç performans düzeyi profilini temsil eder:
//   • yüksek (~%85 ortalama)
//   • orta   (~%70 ortalama)
//   • düşük  (~%50 ortalama)
//
// Her öğrenci için 40 soruluk bir deneme sınavı yanıt seti tanımlanmıştır.
// Sorular SORU_BANKASI havuzundan seçilmiştir.

import { SORU_BANKASI, type Soru } from './soruBankasi';

export type OgrenciYanit = {
  soruId: string;
  dogru: boolean;
};

export type Ogrenci = {
  id: string;
  ad: string;
  sube: string;
  yanitlar: OgrenciYanit[];
  // Öğrencinin son 30 günde çözdüğü soru kimlikleri (Kural 3 — tekrar önleme)
  son30GunCozulen: string[];
  // Önceki deneme sınavındaki kazanım başarı yüzdeleri (delta hesabı için)
  oncekiKazanimBasari: Record<string, number>;
};

// --- Yardımcı: belirli ID'lerden yanıt seti üretmek için ---------------------
function setYanit(idler: string[], yanlislar: Set<string>): OgrenciYanit[] {
  return idler.map(id => ({ soruId: id, dogru: !yanlislar.has(id) }));
}

// 40 soruluk ortak deneme sınavı — bu liste 28 kazanımın 12'sini içeriyor
// ancak gerçek soru havuzunun bir alt kümesi.
const ORTAK_SINAV: string[] = (() => {
  // her kazanımdan en fazla 2 soru alarak 40 yakın bir set kuruyoruz
  const sayilar: Record<string, number> = {};
  const ids: string[] = [];
  for (const s of SORU_BANKASI) {
    sayilar[s.kazanimKod] = (sayilar[s.kazanimKod] ?? 0) + 1;
    if (sayilar[s.kazanimKod] <= 2) ids.push(s.id);
    if (ids.length >= 40) break;
  }
  return ids;
})();

export const ORNEK_SINAV_SORU_ID: string[] = ORTAK_SINAV;

// Sınavın hangi kazanımları kapsadığını dışarıya da açalım
export const ORNEK_SINAV_KAPSAM_KAZANIMLAR: string[] = Array.from(
  new Set(
    ORTAK_SINAV.map(id => {
      const s = SORU_BANKASI.find((q: Soru) => q.id === id);
      return s ? s.kazanimKod : '';
    }).filter(Boolean)
  )
);

// Sınav 20 kazanımı 2'şer soru olarak kapsamaktadır.
// Yanlış cevap kümeleri yalnızca ORTAK_SINAV içindeki sorular üzerinden tanımlanır.

// --- Öğrenci 1: yüksek performans (≈ %87 doğru) -----------------------------
// İlerleme: modelleme (11.3.2.2) güçlü eksik; birkaç düşük kritiklik kazanımı.
const O01_YANLIS = new Set([
  'S-11.3.2.2-01', 'S-11.3.2.2-02', // 11.3.2.2 → 0%  (yüksek kritiklik)
  'S-11.4.1.1-02',                  // 11.4.1.1 → 50% (düşük kritiklik)
  'S-11.1.2.5-02',                  // 11.1.2.5 → 50% (düşük kritiklik)
  'S-11.2.1.2-02',                  // 11.2.1.2 → 50% (düşük kritiklik)
]);

// --- Öğrenci 2: orta performans (≈ %70 doğru) -------------------------------
const O02_YANLIS = new Set([
  'S-11.3.2.2-01', 'S-11.3.2.2-02', // 11.3.2.2 → 0%
  'S-11.4.1.1-01', 'S-11.4.1.1-02', // 11.4.1.1 → 0%
  'S-11.1.2.5-01', 'S-11.1.2.5-02', // 11.1.2.5 → 0%
  'S-11.4.2.2-02',                  // 11.4.2.2 → 50%
  'S-11.1.2.4-02',                  // 11.1.2.4 → 50%
  'S-11.2.1.4-02',                  // 11.2.1.4 → 50%
  'S-11.3.3.1-02',                  // 11.3.3.1 → 50%
  'S-11.4.2.1-02',                  // 11.4.2.1 → 50%
  'S-11.5.1.2-02',                  // 11.5.1.2 → 50%
]);

// --- Öğrenci 3: düşük performans (≈ %50 doğru) ------------------------------
const O03_YANLIS = new Set([
  'S-11.1.2.1-01', 'S-11.1.2.1-02', // 11.1.2.1 → 0% (öncül kavram, yüksek)
  'S-11.1.2.2-01', 'S-11.1.2.2-02', // 11.1.2.2 → 0%
  'S-11.1.2.3-01', 'S-11.1.2.3-02', // 11.1.2.3 → 0%
  'S-11.1.2.4-01', 'S-11.1.2.4-02', // 11.1.2.4 → 0%
  'S-11.1.2.5-01', 'S-11.1.2.5-02', // 11.1.2.5 → 0%
  'S-11.3.2.2-01', 'S-11.3.2.2-02', // 11.3.2.2 → 0%
  'S-11.4.1.1-01', 'S-11.4.1.1-02', // 11.4.1.1 → 0%
  'S-11.4.2.1-01', 'S-11.4.2.1-02', // 11.4.2.1 → 0%
  'S-11.4.2.2-01', 'S-11.4.2.2-02', // 11.4.2.2 → 0%
  'S-11.2.1.2-02',                  // 11.2.1.2 → 50%
  'S-11.5.1.1-02',                  // 11.5.1.1 → 50%
]);

export const OGRENCILER: Ogrenci[] = [
  {
    id: 'O01',
    ad: 'Ayşe K.',
    sube: '11-A',
    yanitlar: setYanit(ORTAK_SINAV, O01_YANLIS),
    // Son 30 günde çözülen — öneri pool'undaki bazı soruları dışlayacak şekilde
    son30GunCozulen: ['S-11.3.2.2-03', 'S-11.4.1.1-03', 'S-11.1.2.5-03'],
    oncekiKazanimBasari: {
      '11.1.1.1': 92, '11.1.1.2': 90, '11.1.2.1': 88, '11.1.2.2': 82,
      '11.1.2.3': 85, '11.1.2.4': 80, '11.1.2.5': 65,
      '11.2.1.1': 95, '11.2.1.2': 78, '11.2.1.3': 90,
      '11.3.1.1': 90, '11.3.2.1': 88, '11.3.2.2': 40,
      '11.4.1.1': 55, '11.4.2.1': 80, '11.4.2.2': 75,
      '11.5.1.1': 92, '11.5.1.2': 85, '11.5.2.1': 88,
      '11.7.1.1': 80, '11.7.1.2': 85, '11.7.1.3': 45, '11.7.2.1': 85,
    },
  },
  {
    id: 'O02',
    ad: 'Mehmet Y.',
    sube: '11-A',
    yanitlar: setYanit(ORTAK_SINAV, O02_YANLIS),
    son30GunCozulen: ['S-11.3.2.2-03', 'S-11.4.1.1-03'],
    oncekiKazanimBasari: {
      '11.1.1.1': 78, '11.1.1.2': 75, '11.1.2.1': 72, '11.1.2.2': 70,
      '11.1.2.3': 68, '11.1.2.4': 65, '11.1.2.5': 35,
      '11.2.1.1': 80, '11.2.1.2': 70, '11.2.1.3': 75,
      '11.3.1.1': 72, '11.3.2.1': 70, '11.3.2.2': 25,
      '11.4.1.1': 20, '11.4.2.1': 70, '11.4.2.2': 50,
      '11.5.1.1': 78, '11.5.1.2': 70, '11.5.2.1': 45,
      '11.7.1.1': 30, '11.7.1.2': 70, '11.7.1.3': 60, '11.7.2.1': 75,
    },
  },
  {
    id: 'O03',
    ad: 'Can A.',
    sube: '11-B',
    yanitlar: setYanit(ORTAK_SINAV, O03_YANLIS),
    son30GunCozulen: ['S-11.1.2.1-03', 'S-11.4.2.1-03'],
    oncekiKazanimBasari: {
      '11.1.1.1': 60, '11.1.1.2': 55, '11.1.2.1': 35, '11.1.2.2': 40,
      '11.1.2.3': 38, '11.1.2.4': 30, '11.1.2.5': 0,
      '11.2.1.1': 65, '11.2.1.2': 55, '11.2.1.3': 50,
      '11.3.1.1': 50, '11.3.2.1': 45, '11.3.2.2': 10,
      '11.4.1.1': 5, '11.4.2.1': 35, '11.4.2.2': 20,
      '11.5.1.1': 60, '11.5.1.2': 50, '11.5.2.1': 25,
      '11.7.1.1': 25, '11.7.1.2': 50, '11.7.1.3': 30, '11.7.2.1': 55,
    },
  },
];

export const OGRENCI_INDEKS: Record<string, Ogrenci> = Object.fromEntries(
  OGRENCILER.map(o => [o.id, o])
);
