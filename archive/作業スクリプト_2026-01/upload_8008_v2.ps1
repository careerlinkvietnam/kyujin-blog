$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{
    Authorization = "Basic $cred"
    "Content-Type" = "application/json; charset=utf-8"
}

# Read the fixed content
$content = Get-Content -Path "C:\Users\siank\Desktop\ClaueCode\post_8008.html" -Raw -Encoding UTF8

# Create proper JSON using ConvertTo-Json
$body = @{content = $content} | ConvertTo-Json -Depth 10

# Save JSON for debugging
$body | Out-File -FilePath "C:\Users\siank\Desktop\ClaueCode\update_8008_debug.json" -Encoding UTF8

Write-Host "JSON created, attempting upload..."

# Update the post using Invoke-WebRequest instead
try {
    $response = Invoke-WebRequest -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/8008" -Method POST -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType "application/json; charset=utf-8" -TimeoutSec 120
    Write-Host "SUCCESS: Post 8008 updated"
    Write-Host "Status: $($response.StatusCode)"
} catch {
    Write-Host "FAILED: $($_.Exception.Message)"
}
