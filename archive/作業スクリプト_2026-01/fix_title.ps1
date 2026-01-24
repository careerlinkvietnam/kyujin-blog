$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{
    Authorization = "Basic $cred"
    "Content-Type" = "application/json; charset=utf-8"
}

$postId = 8134
$newTitle = "ベトナム就労ビザ・労働許可証申請方法完全ガイド2026【必要書類・手順・費用】"

$body = @{
    title = $newTitle
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/$postId" -Method POST -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType "application/json; charset=utf-8"
    Write-Host "SUCCESS: Title updated to: $newTitle"
} catch {
    Write-Host "FAILED: Error: $($_.Exception.Message)"
}
