# Vercel “hareket yok” / eski commit’te kalma

## Ne oluyor?

- **Cursor veya bilgisayar Vercel’e doğrudan deploy atmaz.** Sadece `git push` yapılır.
- Canlı siteyi güncelleyen şey genelde **GitHub → Vercel webhook**’udur (push olunca Vercel build başlar).
- GitHub’da `main` **yeni commit** gösteriyorsa ama Vercel’de “Current” hâlâ **eski commit** (ör. `5032b6b`) ise: **webhook veya Git entegrasyonu kopmuştur** — “bir anda” genelde şunlarla olur:
  - GitHub’da Vercel uygulamasının repo izni kısıtlandı / yeniden yetkilendirme gerekti
  - Webhook silindi veya sürekli hata alıyor (GitHub → Repo **Settings → Webhooks**)
  - Vercel’de proje başka repoya bağlandı / Git bağlantısı bozuldu

## Hızlı düzeltme (önce bunu dene)

1. **Vercel** → `the_bridge` → **Settings** → **Git**
2. **Disconnect** → ardından **Connect Git Repository** → `hhesasturk/the_bridge` → **main**
3. Birkaç dakika bekle; olmazsa **Deployments** üzerinden yeni bir satır oluşuyor mu bak.

## GitHub webhook kontrolü

1. GitHub → repo **`the_bridge`** → **Settings** → **Webhooks**
2. `vercel.com` adresli kayıt var mı? **Recent Deliveries** içinde kırmızı hata var mı?
3. Hata varsa: Vercel’de Git’i yukarıdaki gibi yeniden bağlamak genelde webhook’u düzeltir.

## Yedek: Deploy Hook (tek secret)

Webhook yine çalışmazsa:

1. **Vercel** → Proje → **Settings** → **Git** → **Deploy Hooks**
2. **Create Hook** → Branch: **`main`** → isim ver → URL’yi kopyala
3. **GitHub** → repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   - Name: `VERCEL_DEPLOY_HOOK`
   - Value: kopyaladığın URL (tam adres)
4. `main`’e her push’ta workflow `Vercel deploy tetikle` bu URL’ye POST atar; Vercel yeni deployment başlatır.

> Secret eklemezsen workflow sadece uyarı verir, build’i kırmaz (yeşil kalır).

## Anında tek seferlik yayın

- Vercel CLI: `npx vercel --prod` (hesap bağlıysa), veya
- Deploy Hook URL’sine tarayıcıdan / `curl -X POST "HOOK_URL"` ile istek at.
