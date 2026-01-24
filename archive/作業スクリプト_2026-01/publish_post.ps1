$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{Authorization = "Basic $cred"}

$file = Get-ChildItem -Path "C:\Users\siank\Desktop\ClaueCode\draft" -Filter "TH-13*.html" | Select-Object -First 1
$title = "タイでリモートワーク求人の探し方2026｜在宅勤務・ハイブリッド勤務完全ガイド"
$slug = "thailand-remote-work-job-guide-2026"

$content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
$body = @{
    title = $title
    slug = $slug
    status = "publish"
    categories = @(54)
    content = $content
} | ConvertTo-Json -Depth 10
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)

try {
    $response = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts" -Method POST -Headers $headers -Body $bodyBytes -ContentType "application/json; charset=utf-8"
    Write-Host "SUCCESS"
    Write-Host "ID: $($response.id)"
    Write-Host "URL: $($response.link)"
} catch {
    Write-Host "FAILED: $($_.Exception.Message)"
}
