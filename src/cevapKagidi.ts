// Cevap kağıdı yönetimi — frontend-only veri katmanı.
// LocalStorage'da sınavları ve öğrenci cevap kağıtlarını saklar;
// mevcut motor.ts ile uyumlu OgrenciYanit[] üretir.

import { SORU_INDEKS, type Soru } from './soruBankasi';
import type { Ogrenci, OgrenciYanit } from './ogrenciler';

// ---------------------------------------------------------------------------
// Tipler
// ---------------------------------------------------------------------------

export type Sik = 'A' | 'B' | 'C' | 'D' | 'E';

/** Bir sınav: hangi sorular, doğru cevap anahtarı, meta veri. */
export type Sinav = {
  id: string;
  ad: string;
  tarih: string;            // YYYY-MM-DD
  soruIdler: string[];      // SORU_BANKASI'ndan ID'ler
  cevapAnahtari: Record<string, Sik>; // soruId -> doğru şık
  not?: string;
  createdAt: number;
};

/** Bir öğrencinin bir sınavdaki cevap kağıdı. */
export type CevapKagidi = {
  id: string;
  sinavId: string;
  ogrenciId: string;
  // soruId -> öğrencinin işaretlediği şık (null = boş)
  isaretlemeler: Record<string, Sik | null>;
  createdAt: number;
};

export type Puan = {
  dogru: number;
  yanlis: number;
  bos: number;
  toplam: number;
  yuzde: number;
  net: number; // klasik 4 yanlış 1 doğru götürür
};

// ---------------------------------------------------------------------------
// LocalStorage
// ---------------------------------------------------------------------------

const KEY_SINAVLAR = 'ttkck.sinavlar.v1';
const KEY_CEVAPLAR = 'ttkck.cevapKagitlari.v1';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadSinavlar(): Sinav[] {
  if (typeof window === 'undefined') return [];
  return safeParse<Sinav[]>(window.localStorage.getItem(KEY_SINAVLAR), []);
}

export function saveSinavlar(list: Sinav[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY_SINAVLAR, JSON.stringify(list));
}

export function loadCevapKagitlari(): CevapKagidi[] {
  if (typeof window === 'undefined') return [];
  return safeParse<CevapKagidi[]>(window.localStorage.getItem(KEY_CEVAPLAR), []);
}

export function saveCevapKagitlari(list: CevapKagidi[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY_CEVAPLAR, JSON.stringify(list));
}

// ---------------------------------------------------------------------------
// CRUD yardımcıları
// ---------------------------------------------------------------------------

export function uid(prefix = ''): string {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function sinavEkle(sinav: Sinav): Sinav[] {
  const list = loadSinavlar();
  list.unshift(sinav);
  saveSinavlar(list);
  return list;
}

export function sinavSil(id: string): Sinav[] {
  const list = loadSinavlar().filter(s => s.id !== id);
  saveSinavlar(list);
  // Bu sınava ait cevap kağıtlarını da silelim
  const cevaplar = loadCevapKagitlari().filter(c => c.sinavId !== id);
  saveCevapKagitlari(cevaplar);
  return list;
}

export function cevapKagidiEkle(ck: CevapKagidi): CevapKagidi[] {
  const list = loadCevapKagitlari();
  list.unshift(ck);
  saveCevapKagitlari(list);
  return list;
}

export function cevapKagidiSil(id: string): CevapKagidi[] {
  const list = loadCevapKagitlari().filter(c => c.id !== id);
  saveCevapKagitlari(list);
  return list;
}

// ---------------------------------------------------------------------------
// Puanlama
// ---------------------------------------------------------------------------

/** Bir cevap kağıdını cevap anahtarına göre puanlar. */
export function puanla(ck: CevapKagidi, sinav: Sinav): Puan {
  let dogru = 0;
  let yanlis = 0;
  let bos = 0;
  for (const sid of sinav.soruIdler) {
    const isaret = ck.isaretlemeler[sid];
    const anahtar = sinav.cevapAnahtari[sid];
    if (!anahtar) {
      bos += 1; // anahtarı tanımsız sorular boş kabul
      continue;
    }
    if (isaret === null || isaret === undefined) {
      bos += 1;
    } else if (isaret === anahtar) {
      dogru += 1;
    } else {
      yanlis += 1;
    }
  }
  const toplam = sinav.soruIdler.length;
  const yuzde = toplam > 0 ? Math.round((dogru / toplam) * 1000) / 10 : 0;
  const net = Math.round((dogru - yanlis / 4) * 100) / 100;
  return { dogru, yanlis, bos, toplam, yuzde, net };
}

/**
 * motor.ts'in beklediği OgrenciYanit[] formatına dönüştürür.
 * Bu sayede mevcut basariOranlariniHesapla() doğrudan çalışır.
 */
export function cevapKagidindanYanit(ck: CevapKagidi, sinav: Sinav): OgrenciYanit[] {
  const sonuc: OgrenciYanit[] = [];
  for (const sid of sinav.soruIdler) {
    // Sadece SORU_INDEKS'te tanımlı olan sorular motor.ts tarafından işlenebilir
    if (!SORU_INDEKS[sid]) continue;
    const isaret = ck.isaretlemeler[sid];
    const anahtar = sinav.cevapAnahtari[sid];
    const dogru = !!(isaret && anahtar && isaret === anahtar);
    sonuc.push({ soruId: sid, dogru });
  }
  return sonuc;
}

/**
 * Mevcut bir Ogrenci'nin (mock) verilerini, yüklenmiş bir cevap kağıdıyla
 * geçici olarak değiştiren bir görünüm üretir. Bu sayede motor.ts'in
 * tüm fonksiyonları yeni veriyle çalışabilir.
 */
export function ogrenciyiYuklenmisIleBirlestir(
  base: Ogrenci,
  ck: CevapKagidi,
  sinav: Sinav
): Ogrenci {
  return {
    ...base,
    yanitlar: cevapKagidindanYanit(ck, sinav),
  };
}

// ---------------------------------------------------------------------------
// Soru filtreleme yardımcıları
// ---------------------------------------------------------------------------

/** Verilen soru ID listesinden Soru[] döner (eksikleri atlar). */
export function sorulariCek(idler: string[]): Soru[] {
  return idler.map(id => SORU_INDEKS[id]).filter((s): s is Soru => !!s);
}

/** Bir sınavın kapsadığı benzersiz kazanım kodlarını döner. */
export function sinavKazanimlari(sinav: Sinav): string[] {
  const set = new Set<string>();
  for (const sid of sinav.soruIdler) {
    const s = SORU_INDEKS[sid];
    if (s) set.add(s.kazanimKod);
  }
  return Array.from(set);
}

// ---------------------------------------------------------------------------
// JSON export/import
// ---------------------------------------------------------------------------

export type YedekPaketi = {
  versiyon: 1;
  tarih: string;
  sinavlar: Sinav[];
  cevapKagitlari: CevapKagidi[];
};

export function yedekUret(): YedekPaketi {
  return {
    versiyon: 1,
    tarih: new Date().toISOString(),
    sinavlar: loadSinavlar(),
    cevapKagitlari: loadCevapKagitlari(),
  };
}

export function yedektenYukle(paket: unknown): { ok: boolean; mesaj: string } {
  if (!paket || typeof paket !== 'object') return { ok: false, mesaj: 'Geçersiz dosya' };
  const p = paket as Partial<YedekPaketi>;
  if (!Array.isArray(p.sinavlar) || !Array.isArray(p.cevapKagitlari)) {
    return { ok: false, mesaj: 'Yedek formatı tanınmıyor' };
  }
  saveSinavlar(p.sinavlar);
  saveCevapKagitlari(p.cevapKagitlari);
  return { ok: true, mesaj: `${p.sinavlar.length} sınav, ${p.cevapKagitlari.length} cevap kağıdı yüklendi.` };
}

export function tumVeriyiSil(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY_SINAVLAR);
  window.localStorage.removeItem(KEY_CEVAPLAR);
}
