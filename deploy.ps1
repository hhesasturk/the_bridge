# GitHub push + Vercel deploy - once Cursor terminalde: gh auth login --web (kodu tarayicida gir)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "GitHub giris kontrol ediliyor..."
gh auth status
if ($LASTEXITCODE -ne 0) {
    Write-Host "Hata: Once baska bir terminalde 'gh auth login --web' calistirip tarayicida kodu girin, sonra bu scripti tekrar calistirin."
    exit 1
}

$desktop = Split-Path (Split-Path $PSScriptRoot -Parent)
if (-not (Test-Path (Join-Path $desktop ".git"))) { $desktop = Split-Path $PSScriptRoot -Parent }
Set-Location $desktop

Write-Host "GitHub repo olusturuluyor ve push ediliyor..."
gh repo create the_bridge --public --source . --remote origin --push --description "The Bridge - influencer is birligi platformu"
if ($LASTEXITCODE -ne 0) {
    git branch -M main 2>$null
    git push -u origin main
}

Write-Host "Vercel deploy (proje klasorunden)..."
Set-Location $PSScriptRoot
$vercel = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercel) { npm i -g vercel }
vercel --prod
