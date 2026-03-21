// Icerik kategorileri - influencer coklu secim yapabilir
export const CONTENT_CATEGORIES = [
  'Moda',
  'Giyim',
  'Tesettur',
  'Fitness',
  'Spor',
  'Saglik',
  'Yemek',
  'Seyahat',
  'Teknoloji',
  'Kitap',
  'Egitim',
  'Yasam Tarzi',
  'Oyun',
  'Guzellik',
  'Anne / Cocuk',
  'Fotografcilik',
  'Kozmetik',
  'Ev dekorasyonu',
  'Finans',
  'Muzik',
]

// Is birligi turleri
export const COLLABORATION_TYPES = [
  'Urun tanitimi',
  'Reels videosu',
  'Story paylasimi',
  'YouTube videosu',
  'Etkinlik katilimi',
  'Affiliate satis',
  'Uzun donem marka elciligi',
]

// Turkiye 81 il (alfabetik)
export const CITIES = [
  'Adana', 'Adiyaman', 'Afyonkarahisar', 'Agri', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydin', 'Balikesir', 'Bartin', 'Batman', 'Bayburt', 'Bilecik',
  'Bingol', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Canakkale', 'Cankiri', 'Corum',
  'Denizli', 'Diyarbakir', 'Duzce', 'Edirne', 'Elazig', 'Erzincan', 'Erzurum', 'Eskisehir',
  'Gaziantep', 'Giresun', 'Gumushane', 'Hakkari', 'Hatay', 'Igdir', 'Isparta', 'Istanbul',
  'Izmir', 'Kahramanmaras', 'Karabuk', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis',
  'Kirikkale', 'Kirklareli', 'Kirsehir', 'Kocaeli', 'Konya', 'Kutahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Mus', 'Mugla', 'Nevsehir', 'Nigde', 'Ordu', 'Osmaniye', 'Rize',
  'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Sanliurfa', 'Sirnak', 'Tekirdag',
  'Tokat', 'Trabzon', 'Tunceli', 'Usak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak',
]

// Filtre ve profil icin "Butun sehirler" secenegi (oneri olarak kullanilir)
export const CITY_FILTER_ALL = 'Butun sehirler'

// Kesfet sayfasinda icerik turu filtre onerileri
export const CONTENT_TYPE_FILTER_OPTIONS = [
  'Reels videosu',
  'Story paylasimi',
  'Urun tanitimi',
  'YouTube videosu',
  'Etkinlik katilimi',
  'Affiliate satis',
  'Uzun donem marka elciligi',
]

// Sosyal medya platformlari (uye olurken secilebilir)
export const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'x', label: 'X (Twitter)' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'facebook', label: 'Facebook' },
]

// Takipci araligi secenekleri (bin)
export const FOLLOWER_RANGES = [
  { label: '1K - 5K', min: 1000, max: 5000 },
  { label: '5K - 10K', min: 5000, max: 10000 },
  { label: '10K - 25K', min: 10000, max: 25000 },
  { label: '25K - 50K', min: 25000, max: 50000 },
  { label: '50K - 100K', min: 50000, max: 100000 },
  { label: '100K+', min: 100000, max: Infinity },
]
