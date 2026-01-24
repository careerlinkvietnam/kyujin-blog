$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{Authorization = "Basic $cred"}

$postId = $args[0]
$post = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/$postId" -Headers $headers

# Output the first 5000 characters of content
$content = $post.content.rendered
if ($content.Length -gt 5000) {
    Write-Host $content.Substring(0, 5000)
    Write-Host "... [truncated]"
} else {
    Write-Host $content
}
