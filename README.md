# The Bridge

Markalar ve mikro influencerlari bulusturan is birligi platformu.

## Ozellikler

- **Ana sayfa:** Hero bolumu ve 3 ozellik karti (Kolay Profil Olustur, Markalar Icin Kesfet, Hizli Is Birligi)
- **Uyelik:** E-posta, kullanici adi ve sifre ile uye ol / giris yap; **Google ile giris / uye ol** (Supabase yapilandirildiysa)
- **Cok cihaz:** Supabase kullanildiginda uye bilgileri ve influencer listesi tum cihazlarda gecerli; herkes Keşfet'te eklenen tum influencerlari gorur
- **Profil olusturma:** Instagram bilgileri, sehir, icerik kategorileri (coklu), is birligi turleri, biyografi
- **Influencer kesfet:** Kategori, takipci araligi, sehir ve icerik turu filtreleri; grid kart listesi (Supabase ile tum kullanicilarin ekledigi profiller)
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

## Yayinlama (Vercel)

- Proje GitHub'a push edildiginde Vercel otomatik deploy alir.
- **Deploy gormuyorsan:** **Domains** sekmesinde build listesi yoktur; ustten **Deployments** sekmesine gec.
- **Hic tetiklenmiyorsa:** Settings > **Git** > bagli repo `hhesasturk/the_bridge`, Production Branch `main` olmali; degilse Git'i yeniden bagla. **Deployments** > ... > **Redeploy** ile manuel alinabilir.
- **maniwebst.com** icin: Vercel Dashboard > Proje (the_bridge) > Settings > Domains > Add: `maniwebst.com` yaz, DNS talimatlarini domain saglayicinda uygula.

## Supabase (opsiyonel)

Cok cihazdan giris ve herkese acik influencer listesi icin:

1. [supabase.com](https://supabase.com) uzerinden proje olusturun.
2. **Authentication > URL Configuration:** Site URL ve Redirect URLs'e `http://localhost:5173` ve canli domain (ornegin `https://maniwebst.com`) ekleyin.
3. **Authentication > Providers:** Google'i acin ve Google Cloud Console'dan Client ID/Secret ekleyin.
4. **SQL Editor:** `supabase-schema.sql` dosyasindaki SQL'i calistirarak `influencers` tablosunu ve RLS politikalarini olusturun.
5. Proje ayarlarindan **Project URL** ve **anon public** key'i alin; `.env.local` dosyasi olusturup `.env.example` icerigine gore `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` tanimlayin.
6. Vercel'de ayni ortam degiskenlerini Proje > Settings > Environment Variables altinda ekleyin.

Supabase yoksa uygulama yerel depolama (localStorage) ile calisir; veriler sadece o cihazda kalir.

## Guvenlik

- `.env` ve `.env.local` dosyalari repoya eklenmez (sifre, API anahtari buraya yazilir).
- GitHub veya Vercel icin kullandigin giris bilgilerini kod icine yazma; gerekirse ortam degiskenlerini Vercel Dashboard'dan ekle.

Kod yapisi asagidaki ozelliklerin eklenmesine uygun tutuldu:

- Premium uyelik
- One cikan influencer sistemi
- Marka hesaplari
- Is birligi ilanlari
- Mesajlasma sistemi

- `src/config/constants.js` – kategoriler, sehirler, takipci araliklari
- `src/data/mockInfluencers.js` – ornek veri (ileride API ile degistirilebilir)
- Sayfa ve bilesenler moduler; yeni sayfalar `src/pages/`, ortak bilesenler `src/components/` altina eklenebilir.
