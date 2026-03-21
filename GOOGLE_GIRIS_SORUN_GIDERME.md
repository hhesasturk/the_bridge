# Google ile giriş 500 hatası – kontrol listesi

"Unexpected failure" (500) hatası alıyorsanız aşağıdakileri **sırayla** deneyin.

---

## 0. ÖNEMLİ: E-posta onayını kapatın (en sık çözüm)

Google ile girişte 500 hatası çoğu zaman **Confirm email** açık olduğu için oluşur. Supabase, Google’dan dönen kullanıcıyı işlerken e-posta doğrulama adımında hata veriyor olabilir.

1. **Supabase Dashboard** → **Authentication** → **Providers** (veya **Kullanıcı Kayıtları / User Registrations** bölümü)
2. **Confirm email** (E-posta onayı) anahtarını **KAPATIN** (OFF).
3. **Değişiklikleri kaydet** deyin.
4. Tekrar “Google ile Giriş Yap” deneyin.

Diğer ayarlar:
- **Allow new users to sign up** → Açık (ON) kalmalı.
- **Allow manual linking** → Kapalı kalabilir.
- **Allow anonymous sign-ins** → Kapalı kalabilir.

---

## 1. Supabase – URL Configuration

1. **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. **Site URL** tam olarak sitenizin adresi olsun:
   - Canlı: `https://maniwebst.com` (sonunda **slash yok**)
   - Yerel: `http://localhost:5173`
3. **Redirect URLs** listesinde mutlaka şunlar olsun (her biri ayrı satır):
   - `https://maniwebst.com`
   - `https://www.maniwebst.com`  ← **www ile giriyorsaniz bu da ekli olsun, yoksa 500 alabilirsiniz**
   - `http://localhost:5173`
4. **Save** deyin.

## 2. Google Cloud Console – Authorized redirect URIs

1. **Google Cloud Console** → **APIs & Services** → **Credentials** → OAuth 2.0 Client ID’nizi açın.
2. **Authorized redirect URIs** bölümünde **sadece** Supabase callback adresi olsun (başka bir şey eklemeyin):
   - `https://wenevqnvsnjugcehzeyt.supabase.co/auth/v1/callback`
   - (Proje ID’niz farklıysa Supabase → Project Settings → API’deki Project URL + `/auth/v1/callback`)
3. Sonunda **slash (/) olmasın**.
4. Kaydedin.

## 3. Google OAuth consent screen – Test kullanıcıları

Uygulama **Testing** modundaysa sadece eklediğiniz e-postalar giriş yapabilir:

1. **Google Cloud Console** → **APIs & Services** → **OAuth consent screen**
2. **Test users** bölümüne giriş yapacak e-posta adreslerini ekleyin.
3. Ya da uygulamayı **Production**’a alıp (Verify gerekiyor) herkese açın.

## 4. Supabase – Google provider

1. **Supabase** → **Authentication** → **Providers** → **Google**
2. **Enable Sign in with Google** açık olsun.
3. **Client ID** ve **Client Secret** Google’dan kopyaladığınız değerlerle aynı olsun (boşluk/eksik karakter olmasın).

---

Bu adımlardan sonra tekrar “Google ile Giriş Yap” deneyin. **Özet:** Önce **Confirm email**’ı kapatın (bölüm 0). Hata sürerse 1–4’ü kontrol edin. Hata sürerse Supabase Dashboard → **Logs** (veya **Authentication** logları) bölümünden ilgili 500 hatasının detayına bakın.
