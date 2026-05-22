// 11. Sınıf Matematik Dersi kazanımları
// Kaynak: T.C. Millî Eğitim Bakanlığı, Ortaöğretim Matematik Dersi (9-12. Sınıflar)
// Öğretim Programı, Ankara, 2018.
// https://mufredat.meb.gov.tr/ProgramDetay.aspx?PID=343

export type Kazanim = {
  kod: string;
  ad: string;
  bolum: string; // 11.x başlığı (ör. Trigonometri)
  konu: string; // alt öğrenme alanı / konu
  alan: string; // öğrenme alanı
};

export const KAZANIMLAR_11: Kazanim[] = [
  // ----- GEOMETRİ · 11.1 Trigonometri -----
  { kod: '11.1.1.1', ad: 'Yönlü açıyı açıklar.', bolum: 'Trigonometri', konu: 'Yönlü Açılar', alan: 'Geometri' },
  { kod: '11.1.1.2', ad: 'Açı ölçü birimlerini açıklayarak birbiri ile ilişkilendirir.', bolum: 'Trigonometri', konu: 'Yönlü Açılar', alan: 'Geometri' },
  { kod: '11.1.2.1', ad: 'Trigonometrik fonksiyonları birim çember yardımıyla açıklar.', bolum: 'Trigonometri', konu: 'Trigonometrik Fonksiyonlar', alan: 'Geometri' },
  { kod: '11.1.2.2', ad: 'Kosinüs teoremiyle ilgili problemler çözer.', bolum: 'Trigonometri', konu: 'Trigonometrik Fonksiyonlar', alan: 'Geometri' },
  { kod: '11.1.2.3', ad: 'Sinüs teoremiyle ilgili problemler çözer.', bolum: 'Trigonometri', konu: 'Trigonometrik Fonksiyonlar', alan: 'Geometri' },
  { kod: '11.1.2.4', ad: 'Trigonometrik fonksiyon grafiklerini çizer.', bolum: 'Trigonometri', konu: 'Trigonometrik Fonksiyonlar', alan: 'Geometri' },
  { kod: '11.1.2.5', ad: 'Sinüs, kosinüs, tanjant fonksiyonlarının ters fonksiyonlarını açıklar.', bolum: 'Trigonometri', konu: 'Trigonometrik Fonksiyonlar', alan: 'Geometri' },

  // ----- GEOMETRİ · 11.2 Analitik Geometri -----
  { kod: '11.2.1.1', ad: 'Analitik düzlemde iki nokta arasındaki uzaklığı veren bağıntıyı elde ederek problemler çözer.', bolum: 'Analitik Geometri', konu: 'Doğrunun Analitik İncelenmesi', alan: 'Geometri' },
  { kod: '11.2.1.2', ad: 'Bir doğru parçasını belli bir oranda (içten veya dıştan) bölen noktanın koordinatlarını hesaplar.', bolum: 'Analitik Geometri', konu: 'Doğrunun Analitik İncelenmesi', alan: 'Geometri' },
  { kod: '11.2.1.3', ad: 'Analitik düzlemde doğruları inceleyerek işlemler yapar.', bolum: 'Analitik Geometri', konu: 'Doğrunun Analitik İncelenmesi', alan: 'Geometri' },
  { kod: '11.2.1.4', ad: 'Bir noktanın bir doğruya uzaklığını hesaplar.', bolum: 'Analitik Geometri', konu: 'Doğrunun Analitik İncelenmesi', alan: 'Geometri' },

  // ----- SAYILAR VE CEBİR · 11.3 Fonksiyonlarda Uygulamalar -----
  { kod: '11.3.1.1', ad: 'Fonksiyonun grafik ve tablo temsilini kullanarak problem çözer.', bolum: 'Fonksiyonlarda Uygulamalar', konu: 'Fonksiyonlarla İlgili Uygulamalar', alan: 'Sayılar ve Cebir' },
  { kod: '11.3.2.1', ad: 'İkinci dereceden bir değişkenli fonksiyonun grafiğini çizerek yorumlar.', bolum: 'Fonksiyonlarda Uygulamalar', konu: 'İkinci Dereceden Fonksiyonlar ve Grafikleri', alan: 'Sayılar ve Cebir' },
  { kod: '11.3.2.2', ad: 'İkinci dereceden fonksiyonlarla modellenebilen problemleri çözer.', bolum: 'Fonksiyonlarda Uygulamalar', konu: 'İkinci Dereceden Fonksiyonlar ve Grafikleri', alan: 'Sayılar ve Cebir' },
  { kod: '11.3.3.1', ad: 'Bir fonksiyonun grafiğinden, dönüşümler yardımı ile yeni fonksiyon grafikleri çizer.', bolum: 'Fonksiyonlarda Uygulamalar', konu: 'Fonksiyonların Dönüşümleri', alan: 'Sayılar ve Cebir' },

  // ----- SAYILAR VE CEBİR · 11.4 Denklem ve Eşitsizlik Sistemleri -----
  { kod: '11.4.1.1', ad: 'İkinci dereceden iki bilinmeyenli denklem sistemlerinin çözüm kümesini bulur.', bolum: 'Denklem ve Eşitsizlik Sistemleri', konu: 'İkinci Dereceden İki Bilinmeyenli Denklem Sistemleri', alan: 'Sayılar ve Cebir' },
  { kod: '11.4.2.1', ad: 'İkinci dereceden bir bilinmeyenli eşitsizliklerin çözüm kümesini bulur.', bolum: 'Denklem ve Eşitsizlik Sistemleri', konu: 'İkinci Dereceden Bir Bilinmeyenli Eşitsizlikler ve Eşitsizlik Sistemleri', alan: 'Sayılar ve Cebir' },
  { kod: '11.4.2.2', ad: 'İkinci dereceden bir bilinmeyenli eşitsizlik sistemlerinin çözüm kümesini bulur.', bolum: 'Denklem ve Eşitsizlik Sistemleri', konu: 'İkinci Dereceden Bir Bilinmeyenli Eşitsizlikler ve Eşitsizlik Sistemleri', alan: 'Sayılar ve Cebir' },

  // ----- GEOMETRİ · 11.5 Çember ve Daire -----
  { kod: '11.5.1.1', ad: 'Çemberde teğet, kiriş, çap, yay ve kesen kavramlarını açıklar.', bolum: 'Çember ve Daire', konu: 'Çemberin Temel Elemanları', alan: 'Geometri' },
  { kod: '11.5.1.2', ad: 'Çemberde kirişin özelliklerini göstererek işlemler yapar.', bolum: 'Çember ve Daire', konu: 'Çemberin Temel Elemanları', alan: 'Geometri' },
  { kod: '11.5.2.1', ad: 'Bir çemberde merkez, çevre, iç, dış ve teğet-kiriş açıların özelliklerini kullanarak işlemler yapar.', bolum: 'Çember ve Daire', konu: 'Çemberde Açılar', alan: 'Geometri' },
  { kod: '11.5.3.1', ad: 'Çemberde teğetin özelliklerini göstererek işlemler yapar.', bolum: 'Çember ve Daire', konu: 'Çemberde Teğet', alan: 'Geometri' },
  { kod: '11.5.4.1', ad: 'Dairenin çevre ve alan bağıntılarını oluşturur.', bolum: 'Çember ve Daire', konu: 'Dairenin Çevresi ve Alanı', alan: 'Geometri' },

  // ----- GEOMETRİ · 11.6 Uzay Geometri -----
  { kod: '11.6.1.1', ad: 'Küre, dik dairesel silindir ve dik dairesel koninin alan ve hacim bağıntılarını oluşturarak işlemler yapar.', bolum: 'Uzay Geometri', konu: 'Katı Cisimler', alan: 'Geometri' },

  // ----- VERİ, SAYMA VE OLASILIK · 11.7 Olasılık -----
  { kod: '11.7.1.1', ad: 'Koşullu olasılığı açıklayarak problemler çözer.', bolum: 'Olasılık', konu: 'Koşullu Olasılık', alan: 'Veri, Sayma ve Olasılık' },
  { kod: '11.7.1.2', ad: 'Bağımlı ve bağımsız olayları açıklayarak gerçekleşme olasılıklarını hesaplar.', bolum: 'Olasılık', konu: 'Koşullu Olasılık', alan: 'Veri, Sayma ve Olasılık' },
  { kod: '11.7.1.3', ad: 'Bileşik olayı açıklayarak gerçekleşme olasılığını hesaplar.', bolum: 'Olasılık', konu: 'Koşullu Olasılık', alan: 'Veri, Sayma ve Olasılık' },
  { kod: '11.7.2.1', ad: 'Deneysel olasılık ile teorik olasılığı ilişkilendirir.', bolum: 'Olasılık', konu: 'Deneysel ve Teorik Olasılık', alan: 'Veri, Sayma ve Olasılık' },
];

export const KAZANIM_KAYNAGI =
  'MEB Ortaöğretim Matematik Dersi (9-12. Sınıflar) Öğretim Programı, Ankara, 2018';
