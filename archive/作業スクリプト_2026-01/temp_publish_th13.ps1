$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Read the HTML file
$file = Get-ChildItem -Path "C:\Users\siank\Desktop\ClaueCode\draft" -Filter "TH-13*.html" | Select-Object -First 1
$content = Get-Content -Path $file.FullName -Raw -Encoding UTF8

# WordPress credentials
$username = "siankatabami"
$appPassword = "NSgx a6vc gupX GboP oSKi LFU5"
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${appPassword}"))

# Create the post
$body = @{
    title = "タイでリモートワーク求人の探し方2026｜在宅勤務・ハイブリッド勤務完全ガイド"
    content = $content
    status = "publish"
    slug = "thailand-remote-work-job-guide-2026"
    categories = @(54)
} | ConvertTo-Json -Depth 10

$headers = @{
    "Authorization" = "Basic $base64Auth"
    "Content-Type" = "application/json; charset=utf-8"
}

$response = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/wp-json/wp/v2/posts" -Method POST -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($body))

Write-Output "Post created with ID: $($response.id)"
Write-Output "URL: $($response.link)"
