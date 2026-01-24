$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{Authorization = "Basic $cred"}

$postId = $args[0]

try {
    # Move to trash (not permanent delete)
    $response = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/$postId" -Method DELETE -Headers $headers
    Write-Host "SUCCESS: Post ID $postId moved to trash"
    Write-Host "Title: $($response.title.rendered)"
} catch {
    Write-Host "FAILED: $($_.Exception.Message)"
}
