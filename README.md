# The Bridge

Markalar ve mikro influencerlari bulusturan is birligi platformu.

## Ozellikler

- **Ana sayfa:** Hero bolumu ve 3 ozellik karti (Kolay Profil Olustur, Markalar Icin Kesfet, Hizli Is Birligi)
- **Uyelik:** E-posta, kullanici adi ve sifre ile uye ol / giris yap (simdilik ucretsiz)
- **Profil olusturma:** Instagram bilgileri, sehir, icerik kategorileri (coklu), is birligi turleri, biyografi
- **Influencer kesfet:** Kategori, takipci araligi, sehir ve icerik turu filtreleri; grid kart listesi
- **Profil detay:** Influencer kart detay sayfasi, Instagram linki, iletisime gec butonu

## Teknolojiler

- React 18
- React Router 6
- Vite 5
- CSS Modules

## Kurulum

```bash
npm install
npm run dev
```

Tarayicida `http://localhost:5173` adresini acin.

## Derleme

```bash
npm run build
npm run preview
```

## Gelecek Icin Altyapi

Kod yapisi asagidaki ozelliklerin eklenmesine uygun tutuldu:

- Premium uyelik
- One cikan influencer sistemi
- Marka hesaplari
- Is birligi ilanlari
- Mesajlasma sistemi

- `src/config/constants.js` – kategoriler, sehirler, takipci araliklari
- `src/data/mockInfluencers.js` – ornek veri (ileride API ile degistirilebilir)
- Sayfa ve bilesenler moduler; yeni sayfalar `src/pages/`, ortak bilesenler `src/components/` altina eklenebilir.
