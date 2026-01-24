param([int]$postId)
$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{Authorization = "Basic $cred"}
$response = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/$postId" -Headers $headers
$response.content.rendered | Out-File -FilePath "C:\Users\siank\Desktop\ClaueCode\post_$postId.html" -Encoding UTF8
Write-Host "Downloaded post $postId"
