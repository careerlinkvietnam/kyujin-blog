$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{Authorization = "Basic $cred"}

$postId = $args[0]
$post = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/$postId" -Headers $headers

# Output full content
$post.content.rendered | Out-File -FilePath "C:\Users\siank\Desktop\ClaueCode\post_$postId.html" -Encoding UTF8
Write-Host "Saved to post_$postId.html"
Write-Host "Title: $($post.title.rendered)"
Write-Host "Length: $($post.content.rendered.Length) characters"
