# 1) Bu scripti calistir. 2) "First copy your one-time code: XXXX-XXXX" cikacak.
# 3) Tarayicida https://github.com/login/device acilacak - kodu yapistir, Authorize de.
# 4) Terminalde "Logged in as hhesasturk" gorunce Enter'a bas (script devam edecek).
# 5) Repo olusur, push edilir, Vercel deploy baslatilir.

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "=== GitHub giris (tarayicida kodu girin) ===" -ForegroundColor Cyan
gh auth login --web --git-protocol https

if ($LASTEXITCODE -ne 0) {
    Write-Host "Giris iptal veya hata. Cikiliyor." -ForegroundColor Red
    exit 1
}

$here = Split-Path $MyInvocation.MyCommand.Path -Parent
Set-Location $here

Write-Host "`n=== GitHub repo olusturuluyor ve push ediliyor ===" -ForegroundColor Cyan
gh repo create the_bridge --public --source . --remote origin --push --description "The Bridge - influencer is birligi platformu"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Repo zaten var olabilir, push deneniyor..." -ForegroundColor Yellow
    git branch -M main 2>$null
    git push -u origin main
}

Write-Host "`n=== Vercel deploy ===" -ForegroundColor Cyan
$v = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $v) { npm i -g vercel }
vercel --prod

Write-Host "`nBitti. maniwebst.com domainini Vercel dashboard > Project > Domains'dan bu projeye bagla." -ForegroundColor Green
