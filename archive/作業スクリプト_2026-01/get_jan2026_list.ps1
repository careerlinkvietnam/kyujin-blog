$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{Authorization = "Basic $cred"}

$posts = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts?per_page=100&status=publish&after=2025-12-31T23:59:59&before=2026-02-01T00:00:00" -Headers $headers

$output = @()
foreach ($post in $posts) {
    $output += "$($post.id)`t$($post.date.Substring(0,10))`t$($post.title.rendered)"
}
$output += ""
$output += "Total: $($posts.Count) posts"

$output | Out-File -FilePath "C:\Users\siank\Desktop\ClaueCode\jan2026_posts.txt" -Encoding UTF8
