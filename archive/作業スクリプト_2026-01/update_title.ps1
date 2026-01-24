$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{Authorization = "Basic $cred"}

$postId = 8318
$newTitle = $args[0]
$body = @{title = $newTitle} | ConvertTo-Json
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)

try {
    $response = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/$postId" -Method POST -Headers $headers -Body $bodyBytes -ContentType "application/json; charset=utf-8"
    Write-Host "SUCCESS: Title updated"
    Write-Host "New Title: $($response.title.rendered)"
} catch {
    Write-Host "FAILED: $($_.Exception.Message)"
}
