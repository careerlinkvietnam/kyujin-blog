$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{Authorization = "Basic $cred"}

# Read the fixed content
$content = Get-Content -Path "C:\Users\siank\Desktop\ClaueCode\post_8008.html" -Raw -Encoding UTF8

# Create JSON body
$body = @{
    content = $content
} | ConvertTo-Json -Depth 10 -Compress

# Update the post
try {
    $response = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/8008" -Method POST -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType "application/json; charset=utf-8"
    Write-Host "SUCCESS: Post 8008 updated"
    Write-Host "Title: $($response.title.rendered)"
} catch {
    Write-Host "FAILED: $($_.Exception.Message)"
    Write-Host $_.Exception.Response
}
