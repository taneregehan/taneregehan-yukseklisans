// Soru bankası — 11. sınıf matematik
// Her soru bir MEB kazanımına eşlenmiştir (önceden uzman tarafından).
// Zorluk: 1 (kolay) ... 5 (zor) — beş düzey, tezin Kural 2 (zorluk uyumu) için.
// Kaynak: çeşitlilik kuralı (Kural 4) için soru havuzunun kaynağı.

export type SoruTur = 'çoktan seçmeli' | 'kısa cevaplı' | 'uygulama';

export type SoruSik = 'A' | 'B' | 'C' | 'D' | 'E';

export type Siklar = { A: string; B: string; C: string; D: string; E: string };

export type Soru = {
  id: string;
  kazanimKod: string;
  /** Kısa konu/açıklama (eski "metin" alanı) */
  metin: string;
  /** Sorunun tam metni (kök) */
  soruMetni: string;
  /** A–E şıkları */
  siklar: Siklar;
  /** Doğru şık */
  dogruSik: SoruSik;
  zorluk: 1 | 2 | 3 | 4 | 5;
  tur: SoruTur;
  kaynak: string;
  // Tahmini çözüm süresi (dakika) — sadece çalışma planı için
  sure: number;
};

export const KAYNAKLAR = [
  'MEB Kazanım Testi',
  'Test Kitabı A',
  'Test Kitabı B',
  'Üniversite Sınav Soruları',
  'Konu Anlatım Kitabı C',
] as const;

// --- Soru havuzu ---------------------------------------------------------
// Her kazanım için 3–4 soru; zorluk ve kaynak çeşitliliği gözetildi.
// id biçimi: S-{kazanimKod}-{indeks}
export const SORU_BANKASI: Soru[] = [
  // ---------- 11.1.1.1 (Yönlü açı) ----------
  { id: 'S-11.1.1.1-01', kazanimKod: '11.1.1.1', metin: 'Yönlü açı kavramı — pozitif/negatif yön ayrımı',
    soruMetni: 'Açı kavramında, saat yönünün tersine süpürülen açının yönü aşağıdakilerden hangisidir?',
    siklar: { A: 'Negatif', B: 'Pozitif', C: 'İşaretsiz', D: 'Sıfır', E: 'Tanımsız' },
    dogruSik: 'B', zorluk: 1, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 4 },
  { id: 'S-11.1.1.1-02', kazanimKod: '11.1.1.1', metin: 'Esas ölçü bulma uygulaması',
    soruMetni: '850° ölçüsündeki bir açının esas ölçüsü kaç derecedir?',
    siklar: { A: '80°', B: '110°', C: '130°', D: '170°', E: '210°' },
    dogruSik: 'C', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı A', sure: 6 },
  { id: 'S-11.1.1.1-03', kazanimKod: '11.1.1.1', metin: 'Yönlü açı işaretine bağlı problem',
    soruMetni: '−1480° ölçüsündeki bir açının pozitif yönlü esas ölçüsü kaç derecedir?',
    siklar: { A: '40°', B: '220°', C: '280°', D: '320°', E: '340°' },
    dogruSik: 'D', zorluk: 3, tur: 'kısa cevaplı', kaynak: 'Test Kitabı B', sure: 8 },

  // ---------- 11.1.1.2 (Açı ölçü birimleri) ----------
  { id: 'S-11.1.1.2-01', kazanimKod: '11.1.1.2', metin: 'Derece–radyan dönüşümü',
    soruMetni: '60° kaç radyandır?',
    siklar: { A: 'π/6', B: 'π/4', C: 'π/3', D: 'π/2', E: '2π/3' },
    dogruSik: 'C', zorluk: 1, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 4 },
  { id: 'S-11.1.1.2-02', kazanimKod: '11.1.1.2', metin: 'Radyan–derece karışık dönüşüm',
    soruMetni: '3π/4 radyanlık bir açının derece cinsinden değeri kaçtır?',
    siklar: { A: '90°', B: '108°', C: '120°', D: '135°', E: '150°' },
    dogruSik: 'D', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'Konu Anlatım Kitabı C', sure: 5 },
  { id: 'S-11.1.1.2-03', kazanimKod: '11.1.1.2', metin: 'Açı ölçüsünde grad sistemi karşılaştırması',
    soruMetni: 'Bir tam dönüşün grad cinsinden değeri 400 grad olduğuna göre, 90°\'nin grad cinsinden karşılığı kaçtır?',
    siklar: { A: '80 g', B: '90 g', C: '100 g', D: '120 g', E: '180 g' },
    dogruSik: 'C', zorluk: 3, tur: 'kısa cevaplı', kaynak: 'Test Kitabı A', sure: 7 },

  // ---------- 11.1.2.1 (Birim çember) ----------
  { id: 'S-11.1.2.1-01', kazanimKod: '11.1.2.1', metin: 'Birim çember üzerinde sin/cos değerleri',
    soruMetni: 'sin 150° + cos 240° işleminin sonucu kaçtır?',
    siklar: { A: '−1', B: '−1/2', C: '0', D: '1/2', E: '1' },
    dogruSik: 'C', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 5 },
  { id: 'S-11.1.2.1-02', kazanimKod: '11.1.2.1', metin: 'Bölge işareti ve eşdeğer açılar',
    soruMetni: 'α açısı II. bölgede olduğuna göre sin α · cos α çarpımının işareti aşağıdakilerden hangisidir?',
    siklar: { A: 'Her zaman pozitif', B: 'Her zaman negatif', C: 'Sıfır', D: 'Bilgi yeterli değil', E: 'α\'ya göre değişir' },
    dogruSik: 'B', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı A', sure: 7 },
  { id: 'S-11.1.2.1-03', kazanimKod: '11.1.2.1', metin: 'İndirgeme formülleri uygulaması',
    soruMetni: 'cos(π/2 + α) ifadesi aşağıdakilerden hangisine eşittir?',
    siklar: { A: 'sin α', B: '−sin α', C: 'cos α', D: '−cos α', E: 'tan α' },
    dogruSik: 'B', zorluk: 4, tur: 'kısa cevaplı', kaynak: 'Üniversite Sınav Soruları', sure: 9 },

  // ---------- 11.1.2.2 (Kosinüs teoremi) ----------
  { id: 'S-11.1.2.2-01', kazanimKod: '11.1.2.2', metin: 'Üçgende bir kenar hesaplama (kosinüs)',
    soruMetni: 'ABC üçgeninde |AB| = 5, |AC| = 8 ve m(BAC) = 60° olduğuna göre |BC| kaç birimdir?',
    siklar: { A: '6', B: '7', C: '√89', D: '8', E: '9' },
    dogruSik: 'B', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 6 },
  { id: 'S-11.1.2.2-02', kazanimKod: '11.1.2.2', metin: 'Üçgende açı hesaplama (kosinüs)',
    soruMetni: 'Kenar uzunlukları 7, 8 ve 13 birim olan bir üçgende en büyük iç açının kosinüsü kaçtır?',
    siklar: { A: '−1/2', B: '−1/4', C: '0', D: '1/4', E: '1/2' },
    dogruSik: 'A', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı B', sure: 7 },
  { id: 'S-11.1.2.2-03', kazanimKod: '11.1.2.2', metin: 'Uygulama: paralelkenar köşegen problemi',
    soruMetni: 'Bir paralelkenarın komşu iki kenarı 6 ve 10 birim, aralarındaki açı 120° olduğuna göre küçük köşegenin uzunluğu kaç birimdir?',
    siklar: { A: '2√19', B: '4√7', C: '14', D: '2√41', E: '8√3' },
    dogruSik: 'A', zorluk: 4, tur: 'uygulama', kaynak: 'Üniversite Sınav Soruları', sure: 10 },

  // ---------- 11.1.2.3 (Sinüs teoremi) ----------
  { id: 'S-11.1.2.3-01', kazanimKod: '11.1.2.3', metin: 'Sinüs teoremi temel uygulama',
    soruMetni: 'ABC üçgeninde m(A) = 30° ve |BC| = 8 birim olduğuna göre çevrel çember yarıçapı R kaç birimdir?',
    siklar: { A: '4', B: '6', C: '8', D: '10', E: '12' },
    dogruSik: 'C', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 5 },
  { id: 'S-11.1.2.3-02', kazanimKod: '11.1.2.3', metin: 'Çevrel çember yarıçapı hesabı',
    soruMetni: 'Kenar uzunlukları 6, 8 ve 10 olan üçgenin çevrel çember yarıçapı kaç birimdir?',
    siklar: { A: '3', B: '4', C: '5', D: '6', E: '8' },
    dogruSik: 'C', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı A', sure: 7 },
  { id: 'S-11.1.2.3-03', kazanimKod: '11.1.2.3', metin: 'Karma problem: sinüs + kosinüs',
    soruMetni: 'ABC üçgeninde |AB| = 6 birim, m(A) = 45° ve m(B) = 60° olduğuna göre |BC| kaç birimdir? (sin 75° = (√6+√2)/4)',
    siklar: { A: '6', B: '6√2 − 6', C: '6√3 − 6', D: '6√3', E: '6√6' },
    dogruSik: 'C', zorluk: 4, tur: 'uygulama', kaynak: 'Üniversite Sınav Soruları', sure: 10 },

  // ---------- 11.1.2.4 (Trig fonksiyon grafikleri) ----------
  { id: 'S-11.1.2.4-01', kazanimKod: '11.1.2.4', metin: 'y = sin x grafiği özellikleri',
    soruMetni: 'y = sin x fonksiyonunun en küçük pozitif periyodu kaçtır?',
    siklar: { A: 'π/2', B: 'π', C: '3π/2', D: '2π', E: '4π' },
    dogruSik: 'D', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 5 },
  { id: 'S-11.1.2.4-02', kazanimKod: '11.1.2.4', metin: 'y = a sin(bx+c) ötelenme/germe',
    soruMetni: 'y = 3 sin(2x − π/3) fonksiyonunun en küçük pozitif periyodu kaçtır?',
    siklar: { A: 'π/3', B: 'π/2', C: 'π', D: '2π', E: '6π' },
    dogruSik: 'C', zorluk: 4, tur: 'kısa cevaplı', kaynak: 'Test Kitabı B', sure: 9 },
  { id: 'S-11.1.2.4-03', kazanimKod: '11.1.2.4', metin: 'Tanjant grafiği asimptot soruları',
    soruMetni: 'y = tan x fonksiyonunun [0, 2π] aralığındaki düşey asimptot sayısı kaçtır?',
    siklar: { A: '0', B: '1', C: '2', D: '3', E: '4' },
    dogruSik: 'C', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Konu Anlatım Kitabı C', sure: 7 },

  // ---------- 11.1.2.5 (Ters trig fonksiyonlar) ----------
  { id: 'S-11.1.2.5-01', kazanimKod: '11.1.2.5', metin: 'arcsin temel değerler',
    soruMetni: 'arcsin(1/2) + arccos(1/2) ifadesinin değeri kaçtır?',
    siklar: { A: 'π/6', B: 'π/4', C: 'π/3', D: 'π/2', E: 'π' },
    dogruSik: 'D', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 5 },
  { id: 'S-11.1.2.5-02', kazanimKod: '11.1.2.5', metin: 'Ters trig fonksiyon tanım kümesi',
    soruMetni: 'y = arcsin x fonksiyonunun tanım kümesi aşağıdakilerden hangisidir?',
    siklar: { A: '(−∞, ∞)', B: '[−π/2, π/2]', C: '[−1, 1]', D: '[0, π]', E: '(0, 1)' },
    dogruSik: 'C', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı A', sure: 7 },
  { id: 'S-11.1.2.5-03', kazanimKod: '11.1.2.5', metin: 'arctan içeren denklem çözümü',
    soruMetni: 'arctan(x) = π/4 denklemini sağlayan x değeri kaçtır?',
    siklar: { A: '0', B: '1/2', C: '1', D: '√2', E: '2' },
    dogruSik: 'C', zorluk: 4, tur: 'kısa cevaplı', kaynak: 'Üniversite Sınav Soruları', sure: 9 },

  // ---------- 11.2.1.1 (İki nokta uzaklık) ----------
  { id: 'S-11.2.1.1-01', kazanimKod: '11.2.1.1', metin: 'Uzaklık formülü temel uygulama',
    soruMetni: 'A(2, 1) ve B(5, 5) noktaları arasındaki uzaklık kaç birimdir?',
    siklar: { A: '3', B: '4', C: '5', D: '√13', E: '7' },
    dogruSik: 'C', zorluk: 1, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 4 },
  { id: 'S-11.2.1.1-02', kazanimKod: '11.2.1.1', metin: 'Verilen noktalara eşit uzaklıkta nokta',
    soruMetni: 'A(0, 0) ve B(8, 0) noktalarına eşit uzaklıkta olan ve x ekseni üzerinde bulunan nokta aşağıdakilerden hangisidir?',
    siklar: { A: '(2, 0)', B: '(3, 0)', C: '(4, 0)', D: '(5, 0)', E: '(6, 0)' },
    dogruSik: 'C', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı A', sure: 7 },
  { id: 'S-11.2.1.1-03', kazanimKod: '11.2.1.1', metin: 'Üçgenin türünü kenar uzaklığıyla bulma',
    soruMetni: 'A(1, 1), B(5, 1), C(3, 5) noktaları bir üçgenin köşeleridir. Bu üçgen aşağıdakilerden hangi türdedir?',
    siklar: { A: 'Eşkenar', B: 'İkizkenar', C: 'Dik', D: 'Çeşitkenar', E: 'İkizkenar dik' },
    dogruSik: 'B', zorluk: 3, tur: 'kısa cevaplı', kaynak: 'Konu Anlatım Kitabı C', sure: 8 },

  // ---------- 11.2.1.2 (Doğru parçasını bölen nokta) ----------
  { id: 'S-11.2.1.2-01', kazanimKod: '11.2.1.2', metin: 'İçten bölme — temel',
    soruMetni: 'A(2, 3) ve B(8, 9) noktaları arasındaki [AB] doğru parçasının orta noktasının koordinatları nedir?',
    siklar: { A: '(3, 6)', B: '(4, 5)', C: '(5, 6)', D: '(6, 5)', E: '(10, 12)' },
    dogruSik: 'C', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 5 },
  { id: 'S-11.2.1.2-02', kazanimKod: '11.2.1.2', metin: 'Dıştan bölme — koordinat hesabı',
    soruMetni: 'A(2, 1) ve B(6, 5) noktaları arasındaki [AB] doğru parçasını A\'dan başlayarak 3:1 oranında bölen P noktasının koordinatları aşağıdakilerden hangisidir?',
    siklar: { A: '(3, 2)', B: '(4, 3)', C: '(5, 4)', D: '(5, 5)', E: '(6, 4)' },
    dogruSik: 'C', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı B', sure: 7 },
  { id: 'S-11.2.1.2-03', kazanimKod: '11.2.1.2', metin: 'Üçgenin ağırlık merkezini bulma',
    soruMetni: 'Köşeleri A(2, 1), B(6, 3) ve C(4, 8) olan üçgenin ağırlık merkezinin koordinatları aşağıdakilerden hangisidir?',
    siklar: { A: '(3, 3)', B: '(4, 4)', C: '(4, 5)', D: '(5, 4)', E: '(6, 6)' },
    dogruSik: 'B', zorluk: 4, tur: 'uygulama', kaynak: 'Üniversite Sınav Soruları', sure: 9 },

  // ---------- 11.2.1.3 (Doğrular) ----------
  { id: 'S-11.2.1.3-01', kazanimKod: '11.2.1.3', metin: 'Eğim ve doğru denklemi',
    soruMetni: 'A(2, 3) ve B(5, 9) noktalarından geçen doğrunun eğimi kaçtır?',
    siklar: { A: '1', B: '3/2', C: '2', D: '3', E: '6' },
    dogruSik: 'C', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 5 },
  { id: 'S-11.2.1.3-02', kazanimKod: '11.2.1.3', metin: 'Paralel ve dik doğrular',
    soruMetni: '2x + 3y − 6 = 0 doğrusuna dik olan bir doğrunun eğimi kaçtır?',
    siklar: { A: '−3/2', B: '−2/3', C: '2/3', D: '3/2', E: '2' },
    dogruSik: 'D', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı A', sure: 7 },
  { id: 'S-11.2.1.3-03', kazanimKod: '11.2.1.3', metin: 'Doğru denklemi karma problem',
    soruMetni: 'A(2, 1) noktasından geçen ve 3x − 4y + 5 = 0 doğrusuna paralel olan doğrunun denklemi aşağıdakilerden hangisidir?',
    siklar: { A: '3x − 4y + 5 = 0', B: '3x − 4y − 2 = 0', C: '4x + 3y − 11 = 0', D: '3x + 4y − 10 = 0', E: '4x − 3y − 5 = 0' },
    dogruSik: 'B', zorluk: 4, tur: 'uygulama', kaynak: 'Üniversite Sınav Soruları', sure: 10 },

  // ---------- 11.2.1.4 (Nokta–doğru uzaklık) ----------
  { id: 'S-11.2.1.4-01', kazanimKod: '11.2.1.4', metin: 'Nokta–doğru uzaklık formülü',
    soruMetni: 'P(2, 3) noktasının 3x + 4y − 5 = 0 doğrusuna uzaklığı kaç birimdir?',
    siklar: { A: '1', B: '12/5', C: '13/5', D: '3', E: '18/5' },
    dogruSik: 'C', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 5 },
  { id: 'S-11.2.1.4-02', kazanimKod: '11.2.1.4', metin: 'İki paralel doğru arası uzaklık',
    soruMetni: '3x + 4y − 1 = 0 ve 3x + 4y + 9 = 0 paralel doğruları arasındaki uzaklık kaç birimdir?',
    siklar: { A: '1', B: '2', C: '5/2', D: '3', E: '4' },
    dogruSik: 'B', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı B', sure: 7 },
  { id: 'S-11.2.1.4-03', kazanimKod: '11.2.1.4', metin: 'Açıortayda nokta uzaklık uygulaması',
    soruMetni: 'P(3, 0) noktasının x + y − 6 = 0 doğrusuna uzaklığı kaç birimdir?',
    siklar: { A: '1', B: '√2', C: '3/2', D: '3√2/2', E: '3' },
    dogruSik: 'D', zorluk: 4, tur: 'kısa cevaplı', kaynak: 'Üniversite Sınav Soruları', sure: 9 },

  // ---------- 11.3.1.1 (Fonksiyon grafik/tablo) ----------
  { id: 'S-11.3.1.1-01', kazanimKod: '11.3.1.1', metin: 'Tablodan grafik okuma',
    soruMetni: 'Aşağıdaki tabloda f fonksiyonunun bazı değerleri verilmiştir.\nx: 1, 2, 3, 4, 5\nf(x): 3, 7, 11, 15, 19\nBuna göre f(2) + f(5) işleminin sonucu kaçtır?',
    siklar: { A: '22', B: '24', C: '26', D: '28', E: '30' },
    dogruSik: 'C', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 5 },
  { id: 'S-11.3.1.1-02', kazanimKod: '11.3.1.1', metin: 'Grafikten fonksiyon değeri çıkarma',
    soruMetni: 'f doğrusal bir fonksiyondur. f(0) = 3 ve f(2) = 7 olduğuna göre f(5) kaçtır?',
    siklar: { A: '9', B: '11', C: '12', D: '13', E: '15' },
    dogruSik: 'D', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı A', sure: 7 },
  { id: 'S-11.3.1.1-03', kazanimKod: '11.3.1.1', metin: 'Gerçek hayat verisi yorumlama',
    soruMetni: 'Bir aracın t saat sonraki hızı v(t) = 60 + 20t (km/sa) bağıntısıyla veriliyor. 2. saat ile 4. saat arasındaki ortalama hız değişim oranı (ivme) km/sa² cinsinden kaçtır?',
    siklar: { A: '10', B: '15', C: '20', D: '30', E: '40' },
    dogruSik: 'C', zorluk: 4, tur: 'uygulama', kaynak: 'Konu Anlatım Kitabı C', sure: 9 },

  // ---------- 11.3.2.1 (2. derece grafik) ----------
  { id: 'S-11.3.2.1-01', kazanimKod: '11.3.2.1', metin: 'Parabolün tepe noktası',
    soruMetni: 'y = x² − 4x + 7 parabolünün tepe noktasının koordinatları nedir?',
    siklar: { A: '(1, 4)', B: '(2, 3)', C: '(2, 11)', D: '(−2, 3)', E: '(4, 7)' },
    dogruSik: 'B', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 5 },
  { id: 'S-11.3.2.1-02', kazanimKod: '11.3.2.1', metin: 'Parabol ile eksen kesişimleri',
    soruMetni: 'y = x² − 5x + 6 parabolünün x ekseni ile kesim noktaları aşağıdakilerden hangisidir?',
    siklar: { A: '(1, 0), (6, 0)', B: '(2, 0), (3, 0)', C: '(−2, 0), (−3, 0)', D: '(1, 0), (5, 0)', E: '(0, 2), (0, 3)' },
    dogruSik: 'B', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı B', sure: 7 },
  { id: 'S-11.3.2.1-03', kazanimKod: '11.3.2.1', metin: 'Parabol grafiğinden a, b, c işareti',
    soruMetni: 'y = ax² + bx + c parabolü x eksenini iki farklı noktada keser. Buna göre diskriminant Δ için aşağıdakilerden hangisi doğrudur?',
    siklar: { A: 'Δ < 0', B: 'Δ = 0', C: 'Δ > 0', D: 'Δ = a + b + c', E: 'Δ = b' },
    dogruSik: 'C', zorluk: 4, tur: 'kısa cevaplı', kaynak: 'Üniversite Sınav Soruları', sure: 9 },

  // ---------- 11.3.2.2 (2. derece modelleme) ----------
  { id: 'S-11.3.2.2-01', kazanimKod: '11.3.2.2', metin: 'Maks. alanı bulma problemi',
    soruMetni: 'Çevresi 40 metre olan bir dikdörtgenin alanının en büyük değeri kaç m²\'dir?',
    siklar: { A: '64', B: '80', C: '96', D: '100', E: '120' },
    dogruSik: 'D', zorluk: 3, tur: 'uygulama', kaynak: 'MEB Kazanım Testi', sure: 8 },
  { id: 'S-11.3.2.2-02', kazanimKod: '11.3.2.2', metin: 'Fırlatma yüksekliği modeli',
    soruMetni: 'Bir cisim yerden yukarı atılıyor ve yüksekliği h(t) = −5t² + 30t (metre) bağıntısıyla veriliyor (t saniye). Cismin ulaşabileceği maksimum yükseklik kaç metredir?',
    siklar: { A: '25', B: '30', C: '35', D: '40', E: '45' },
    dogruSik: 'E', zorluk: 4, tur: 'uygulama', kaynak: 'Test Kitabı A', sure: 10 },
  { id: 'S-11.3.2.2-03', kazanimKod: '11.3.2.2', metin: 'İşletme kâr modeli — minimum maliyet',
    soruMetni: 'Bir işletmenin günlük maliyeti C(x) = x² − 40x + 600 (TL) ile veriliyor (x: günlük üretim adedi). Minimum maliyet kaç TL\'dir?',
    siklar: { A: '100', B: '150', C: '200', D: '250', E: '400' },
    dogruSik: 'C', zorluk: 5, tur: 'uygulama', kaynak: 'Üniversite Sınav Soruları', sure: 12 },

  // ---------- 11.3.3.1 (Grafik dönüşümleri) ----------
  { id: 'S-11.3.3.1-01', kazanimKod: '11.3.3.1', metin: 'Öteleme dönüşümü',
    soruMetni: 'y = f(x) fonksiyonunun grafiği, y = f(x − 3) + 2 fonksiyonunun grafiğine nasıl dönüşür?',
    siklar: { A: 'Sola 3, aşağı 2', B: 'Sağa 3, yukarı 2', C: 'Sağa 3, aşağı 2', D: 'Sola 3, yukarı 2', E: 'Yatayda değişmez' },
    dogruSik: 'B', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 5 },
  { id: 'S-11.3.3.1-02', kazanimKod: '11.3.3.1', metin: 'Yansıma ve germe',
    soruMetni: 'y = f(x) fonksiyonunun grafiği y = −2·f(x) fonksiyonunun grafiğine dönüştürülürken hangi işlemler sırasıyla uygulanır?',
    siklar: { A: 'Sadece x eksenine yansıma', B: 'Sadece dikeyde 2 kat germe', C: 'x eksenine yansıma + dikeyde 2 kat germe', D: 'y eksenine yansıma + yatayda 2 kat germe', E: 'Yatayda yansıma' },
    dogruSik: 'C', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı B', sure: 7 },
  { id: 'S-11.3.3.1-03', kazanimKod: '11.3.3.1', metin: 'Karma dönüşüm uygulaması',
    soruMetni: 'f(x) = x² fonksiyonunun grafiği önce y eksenine göre yansıtılıyor, sonra sağa 1 birim ötele­niyor. Elde edilen fonksiyon aşağıdakilerden hangisidir?',
    siklar: { A: '−x²', B: 'x² + 1', C: '(x + 1)²', D: '(x − 1)²', E: '−(x − 1)²' },
    dogruSik: 'D', zorluk: 4, tur: 'kısa cevaplı', kaynak: 'Üniversite Sınav Soruları', sure: 9 },

  // ---------- 11.4.1.1 (2. derece 2 bilinmeyenli denklem) ----------
  { id: 'S-11.4.1.1-01', kazanimKod: '11.4.1.1', metin: 'Doğru–parabol kesişimi',
    soruMetni: 'y = x² ve y = 2x + 3 denklemlerinin oluşturduğu sistemin çözüm sayısı kaçtır?',
    siklar: { A: '0', B: '1', C: '2', D: '3', E: 'Sonsuz' },
    dogruSik: 'C', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 7 },
  { id: 'S-11.4.1.1-02', kazanimKod: '11.4.1.1', metin: 'Parabol–parabol kesişimi',
    soruMetni: 'y = x² + 1 ve y = −x² + 5 parabollerinin kesim noktalarının apsisleri toplamı kaçtır?',
    siklar: { A: '−2', B: '−√2', C: '0', D: '√2', E: '2' },
    dogruSik: 'C', zorluk: 4, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı A', sure: 9 },
  { id: 'S-11.4.1.1-03', kazanimKod: '11.4.1.1', metin: 'Sistem çözümünün geometrik yorumu',
    soruMetni: 'y = x² + 1 parabolü ile y = mx doğrusunun tek bir ortak noktası olması için m\'nin alabileceği değerler aşağıdakilerden hangisidir?',
    siklar: { A: 'm = −2 veya m = 2', B: 'm = 0', C: 'm = 1', D: 'm = ±√2', E: 'm = −1 veya m = 1' },
    dogruSik: 'A', zorluk: 4, tur: 'uygulama', kaynak: 'Üniversite Sınav Soruları', sure: 10 },

  // ---------- 11.4.2.1 (2. derece eşitsizlik) ----------
  { id: 'S-11.4.2.1-01', kazanimKod: '11.4.2.1', metin: 'Tablo yöntemiyle eşitsizlik',
    soruMetni: 'x² − x − 6 > 0 eşitsizliğinin gerçek sayılardaki çözüm kümesi aşağıdakilerden hangisidir?',
    siklar: { A: '(−2, 3)', B: '(−∞, −2) ∪ (3, ∞)', C: '(−3, 2)', D: '∅', E: '(−∞, ∞)' },
    dogruSik: 'B', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 6 },
  { id: 'S-11.4.2.1-02', kazanimKod: '11.4.2.1', metin: 'Çarpanlara ayırarak eşitsizlik çözümü',
    soruMetni: '(x − 1)(x + 4) ≤ 0 eşitsizliğinin gerçek sayılardaki çözüm kümesi aşağıdakilerden hangisidir?',
    siklar: { A: '[−4, 1]', B: '(−4, 1)', C: '(−∞, −4] ∪ [1, ∞)', D: '[−1, 4]', E: '(1, 4]' },
    dogruSik: 'A', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı B', sure: 7 },
  { id: 'S-11.4.2.1-03', kazanimKod: '11.4.2.1', metin: 'Mutlak değer içeren eşitsizlik',
    soruMetni: '|x − 3| < 5 eşitsizliğinin çözüm kümesi aşağıdakilerden hangisidir?',
    siklar: { A: '(−2, 8)', B: '[−2, 8]', C: '(3, 5)', D: '(−5, 5)', E: '(−8, 2)' },
    dogruSik: 'A', zorluk: 4, tur: 'kısa cevaplı', kaynak: 'Üniversite Sınav Soruları', sure: 9 },

  // ---------- 11.4.2.2 (Eşitsizlik sistemleri) ----------
  { id: 'S-11.4.2.2-01', kazanimKod: '11.4.2.2', metin: 'İki eşitsizlik sisteminin çözüm kümesi',
    soruMetni: 'x ≥ 2 ve x < 7 eşitsizliklerini birlikte sağlayan reel sayıların kümesi aşağıdakilerden hangisidir?',
    siklar: { A: '[2, 7]', B: '[2, 7)', C: '(2, 7)', D: '(2, 7]', E: '(−∞, 2] ∪ [7, ∞)' },
    dogruSik: 'B', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 7 },
  { id: 'S-11.4.2.2-02', kazanimKod: '11.4.2.2', metin: 'Rasyonel eşitsizlik sistemi',
    soruMetni: '(x − 1)/(x + 2) ≥ 0 eşitsizliğinin gerçek sayılardaki çözüm kümesi aşağıdakilerden hangisidir?',
    siklar: { A: '[1, ∞)', B: '(−∞, −2) ∪ [1, ∞)', C: '(−∞, −2] ∪ [1, ∞)', D: '(−2, 1)', E: '[−2, 1]' },
    dogruSik: 'B', zorluk: 4, tur: 'kısa cevaplı', kaynak: 'Test Kitabı A', sure: 9 },

  // ---------- 11.5.1.1 (Çember temel elemanları) ----------
  { id: 'S-11.5.1.1-01', kazanimKod: '11.5.1.1', metin: 'Teğet–kiriş–çap ayırma',
    soruMetni: 'Bir çemberin merkezinden geçen ve uçları çember üzerinde bulunan doğru parçasının özel adı nedir?',
    siklar: { A: 'Yarıçap', B: 'Çap', C: 'Kiriş', D: 'Teğet', E: 'Kesen' },
    dogruSik: 'B', zorluk: 1, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 4 },
  { id: 'S-11.5.1.1-02', kazanimKod: '11.5.1.1', metin: 'Yay ölçüsü kavramı',
    soruMetni: 'Yarıçapı 6 cm olan bir çemberde merkez açısı 60° olan yayın uzunluğu kaç cm\'dir?',
    siklar: { A: 'π', B: '2π', C: '3π', D: '4π', E: '6π' },
    dogruSik: 'B', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı B', sure: 5 },
  { id: 'S-11.5.1.1-03', kazanimKod: '11.5.1.1', metin: 'Kesen–teğet ilişkisi',
    soruMetni: 'Bir çembere dış noktasından çizilen teğetin uzunluğu 12 ve aynı dış noktadan çizilen kesenin uzak noktaya olan uzaklığı 16 birim ise yakın noktaya olan uzaklığı kaç birimdir?',
    siklar: { A: '6', B: '8', C: '9', D: '12', E: '16' },
    dogruSik: 'C', zorluk: 3, tur: 'kısa cevaplı', kaynak: 'Konu Anlatım Kitabı C', sure: 7 },

  // ---------- 11.5.1.2 (Kirişin özellikleri) ----------
  { id: 'S-11.5.1.2-01', kazanimKod: '11.5.1.2', metin: 'Eşit kirişler ve merkez uzaklığı',
    soruMetni: 'Bir çemberde eşit uzunluktaki iki kirişin merkeze uzaklıkları arasındaki ilişki için aşağıdakilerden hangisi doğrudur?',
    siklar: { A: 'Eşittir', B: 'Farklıdır', C: 'Toplamı yarıçapa eşittir', D: 'Çarpımları sabittir', E: 'Belirlenemez' },
    dogruSik: 'A', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 6 },
  { id: 'S-11.5.1.2-02', kazanimKod: '11.5.1.2', metin: 'Kiriş–dik uzaklık problemleri',
    soruMetni: 'Yarıçapı 13 birim olan bir çemberde merkeze uzaklığı 5 birim olan bir kirişin uzunluğu kaç birimdir?',
    siklar: { A: '12', B: '18', C: '20', D: '24', E: '26' },
    dogruSik: 'D', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı A', sure: 7 },
  { id: 'S-11.5.1.2-03', kazanimKod: '11.5.1.2', metin: 'Çember içi kiriş kombinasyonu',
    soruMetni: 'Yarıçapı 10 birim olan bir çemberde iki kirişin uzunlukları 12 ve 16 birimdir. Bu kirişlerin merkeze uzaklıklarının toplamı kaç birimdir?',
    siklar: { A: '10', B: '12', C: '14', D: '16', E: '18' },
    dogruSik: 'C', zorluk: 4, tur: 'uygulama', kaynak: 'Üniversite Sınav Soruları', sure: 9 },

  // ---------- 11.5.2.1 (Çemberde açılar) ----------
  { id: 'S-11.5.2.1-01', kazanimKod: '11.5.2.1', metin: 'Merkez ve çevre açı',
    soruMetni: 'Bir çemberde aynı yayı gören merkez açının ölçüsü 80° ise bu yayı gören çevre açının ölçüsü kaç derecedir?',
    siklar: { A: '20°', B: '30°', C: '40°', D: '50°', E: '80°' },
    dogruSik: 'C', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 6 },
  { id: 'S-11.5.2.1-02', kazanimKod: '11.5.2.1', metin: 'Teğet–kiriş açısı',
    soruMetni: 'Bir çemberde teğet ile kiriş arasındaki açı 35° ise bu açının gördüğü yayın ölçüsü kaç derecedir?',
    siklar: { A: '17,5°', B: '35°', C: '55°', D: '70°', E: '145°' },
    dogruSik: 'D', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı B', sure: 7 },
  { id: 'S-11.5.2.1-03', kazanimKod: '11.5.2.1', metin: 'İç ve dış açı karışık',
    soruMetni: 'Bir çemberde iki kirişin kesişiminde oluşan iç açı; bu açının gördüğü ters yayların ölçülerinin aritmetik ortalamasına eşittir. Yaylar 80° ve 40° ise iç açı kaç derecedir?',
    siklar: { A: '30°', B: '40°', C: '60°', D: '80°', E: '120°' },
    dogruSik: 'C', zorluk: 4, tur: 'kısa cevaplı', kaynak: 'Üniversite Sınav Soruları', sure: 9 },

  // ---------- 11.5.3.1 (Çemberde teğet) ----------
  { id: 'S-11.5.3.1-01', kazanimKod: '11.5.3.1', metin: 'Teğetin dikliği — temel',
    soruMetni: 'Bir çembere değme noktasından çizilen teğet ile bu noktaya çizilen yarıçap arasındaki açı kaç derecedir?',
    siklar: { A: '30°', B: '45°', C: '60°', D: '90°', E: '120°' },
    dogruSik: 'D', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 5 },
  { id: 'S-11.5.3.1-02', kazanimKod: '11.5.3.1', metin: 'Dış noktadan çizilen iki teğet',
    soruMetni: 'Bir dış noktadan çembere çizilen iki teğet parçasının uzunlukları arasındaki ilişki için aşağıdakilerden hangisi doğrudur?',
    siklar: { A: 'Eşittir', B: 'Toplamı yarıçapa eşittir', C: 'Birbirine diktir', D: 'Farklıdır', E: 'Çarpımı yarıçapın karesidir' },
    dogruSik: 'A', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı A', sure: 7 },

  // ---------- 11.5.4.1 (Daire çevre/alan) ----------
  { id: 'S-11.5.4.1-01', kazanimKod: '11.5.4.1', metin: 'Çember–daire çevre/alan',
    soruMetni: 'Yarıçapı 6 cm olan bir dairenin alanı kaç cm²\'dir?',
    siklar: { A: '6π', B: '12π', C: '24π', D: '36π', E: '72π' },
    dogruSik: 'D', zorluk: 1, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 4 },
  { id: 'S-11.5.4.1-02', kazanimKod: '11.5.4.1', metin: 'Daire diliminin alanı',
    soruMetni: 'Yarıçapı 10 cm olan bir dairenin 90°\'lik dilimi kaç cm² alana sahiptir?',
    siklar: { A: '10π', B: '20π', C: '25π', D: '50π', E: '100π' },
    dogruSik: 'C', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı B', sure: 5 },
  { id: 'S-11.5.4.1-03', kazanimKod: '11.5.4.1', metin: 'Daire parçası uygulaması',
    soruMetni: 'Yarıçapı 12 cm olan bir dairede merkez açısı 60° olan dilimin çevresi (iki yarıçap + yay) kaç cm\'dir?',
    siklar: { A: '4π', B: '4π + 24', C: '6π + 12', D: '12π', E: '24π' },
    dogruSik: 'B', zorluk: 3, tur: 'uygulama', kaynak: 'Konu Anlatım Kitabı C', sure: 7 },

  // ---------- 11.6.1.1 (Uzay geometri) ----------
  { id: 'S-11.6.1.1-01', kazanimKod: '11.6.1.1', metin: 'Silindir alan/hacim',
    soruMetni: 'Taban yarıçapı 5 cm ve yüksekliği 10 cm olan bir silindirin hacmi kaç cm³\'tür?',
    siklar: { A: '50π', B: '100π', C: '150π', D: '250π', E: '500π' },
    dogruSik: 'D', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 6 },
  { id: 'S-11.6.1.1-02', kazanimKod: '11.6.1.1', metin: 'Koni alan/hacim ilişkisi',
    soruMetni: 'Taban yarıçapı 6 cm ve yüksekliği 8 cm olan bir koninin yan yüzey alanı kaç cm²\'dir?',
    siklar: { A: '24π', B: '36π', C: '48π', D: '60π', E: '96π' },
    dogruSik: 'D', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı A', sure: 7 },
  { id: 'S-11.6.1.1-03', kazanimKod: '11.6.1.1', metin: 'Küre hacmi karma problem',
    soruMetni: 'Yarıçapı 6 cm olan bir kürenin hacminin yüzey alanına oranı kaç cm\'dir?',
    siklar: { A: '1', B: '2', C: '3', D: '4', E: '6' },
    dogruSik: 'B', zorluk: 4, tur: 'uygulama', kaynak: 'Üniversite Sınav Soruları', sure: 9 },

  // ---------- 11.7.1.1 (Koşullu olasılık) ----------
  { id: 'S-11.7.1.1-01', kazanimKod: '11.7.1.1', metin: 'Koşullu olasılık temel kavram',
    soruMetni: 'Bir zar atıldığında gelen sayının çift olduğu bilindiğine göre, sayının 4\'ten büyük olma olasılığı kaçtır?',
    siklar: { A: '1/6', B: '1/3', C: '1/2', D: '2/3', E: '1' },
    dogruSik: 'B', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 5 },
  { id: 'S-11.7.1.1-02', kazanimKod: '11.7.1.1', metin: 'Bayes uygulaması — kart problemi',
    soruMetni: '52 kartlık bir desteden çekilen kartın kupa olduğu bilindiğine göre, kartın aynı zamanda as olma olasılığı kaçtır?',
    siklar: { A: '1/52', B: '4/13', C: '1/13', D: '1/4', E: '13/52' },
    dogruSik: 'C', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı B', sure: 7 },
  { id: 'S-11.7.1.1-03', kazanimKod: '11.7.1.1', metin: 'Koşullu olasılık — torba problemi',
    soruMetni: 'Bir torbada 4 kırmızı, 6 mavi top bulunmaktadır. Yerine konulmadan peş peşe iki top çekiliyor. Birinci çekilen topun kırmızı olduğu bilindiğine göre, ikincinin de kırmızı olma olasılığı kaçtır?',
    siklar: { A: '1/9', B: '1/5', C: '1/3', D: '2/9', E: '4/9' },
    dogruSik: 'C', zorluk: 4, tur: 'uygulama', kaynak: 'Üniversite Sınav Soruları', sure: 9 },

  // ---------- 11.7.1.2 (Bağımlı/bağımsız olaylar) ----------
  { id: 'S-11.7.1.2-01', kazanimKod: '11.7.1.2', metin: 'Bağımsız olay çarpım kuralı',
    soruMetni: 'Bağımsız iki olayın olasılıkları sırasıyla 0,4 ve 0,5 olduğuna göre iki olayın birlikte gerçekleşme olasılığı kaçtır?',
    siklar: { A: '0,1', B: '0,2', C: '0,3', D: '0,5', E: '0,9' },
    dogruSik: 'B', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 5 },
  { id: 'S-11.7.1.2-02', kazanimKod: '11.7.1.2', metin: 'Ardışık çekilişlerde bağımlılık',
    soruMetni: 'Bir torbada 3 beyaz, 5 siyah top vardır. Yerine konulmadan peş peşe iki top çekiliyor. Çekilen iki topun da beyaz olma olasılığı kaçtır?',
    siklar: { A: '1/14', B: '3/28', C: '3/16', D: '1/4', E: '9/64' },
    dogruSik: 'B', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı A', sure: 7 },

  // ---------- 11.7.1.3 (Bileşik olay) ----------
  { id: 'S-11.7.1.3-01', kazanimKod: '11.7.1.3', metin: 'Birleşim/Kesişim olasılığı',
    soruMetni: 'A ve B olayları için P(A) = 0,5, P(B) = 0,4 ve P(A ∩ B) = 0,2 olduğuna göre P(A ∪ B) kaçtır?',
    siklar: { A: '0,3', B: '0,6', C: '0,7', D: '0,9', E: '1,1' },
    dogruSik: 'C', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 6 },
  { id: 'S-11.7.1.3-02', kazanimKod: '11.7.1.3', metin: 'Bileşik olay — kart oyunu',
    soruMetni: '52 kartlık bir desteden çekilen bir kartın resimli kart (J, Q veya K) ya da kupa olma olasılığı kaçtır?',
    siklar: { A: '11/26', B: '25/52', C: '1/2', D: '3/13', E: '5/13' },
    dogruSik: 'A', zorluk: 4, tur: 'kısa cevaplı', kaynak: 'Üniversite Sınav Soruları', sure: 8 },

  // ---------- 11.7.2.1 (Deneysel–teorik olasılık) ----------
  { id: 'S-11.7.2.1-01', kazanimKod: '11.7.2.1', metin: 'Deneysel olasılık tahmini',
    soruMetni: 'Bir madeni para 100 kez atıldığında 58 kez yazı, 42 kez tura gelmiştir. Bu deneye göre yazı gelme olasılığının deneysel değeri kaçtır?',
    siklar: { A: '0,42', B: '0,50', C: '0,58', D: '0,80', E: '1,00' },
    dogruSik: 'C', zorluk: 2, tur: 'çoktan seçmeli', kaynak: 'MEB Kazanım Testi', sure: 5 },
  { id: 'S-11.7.2.1-02', kazanimKod: '11.7.2.1', metin: 'Frekans tablosundan olasılık',
    soruMetni: 'Bir markette günde satılan ürün sayıları: Süt 30, Ekmek 50, Su 20. Rastgele seçilen bir satışın süt olmasının deneysel olasılığı kaçtır?',
    siklar: { A: '0,20', B: '0,30', C: '0,50', D: '0,60', E: '1,00' },
    dogruSik: 'B', zorluk: 3, tur: 'çoktan seçmeli', kaynak: 'Test Kitabı B', sure: 6 },
  { id: 'S-11.7.2.1-03', kazanimKod: '11.7.2.1', metin: 'Büyük sayılar yasası uygulaması',
    soruMetni: 'Hilesiz bir zar 6000 kez atıldığında 4 gelme sayısının yaklaşık değeri aşağıdakilerden hangisidir?',
    siklar: { A: '600', B: '800', C: '1000', D: '1500', E: '2000' },
    dogruSik: 'C', zorluk: 4, tur: 'uygulama', kaynak: 'Konu Anlatım Kitabı C', sure: 9 },
];

// Bilgi: havuzda toplam 28 kazanım için ~83 soru bulunmaktadır.
export const SORU_INDEKS: Record<string, Soru> = Object.fromEntries(
  SORU_BANKASI.map(s => [s.id, s])
);
