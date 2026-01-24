$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{Authorization = "Basic $cred"}

$posts = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts?per_page=100&status=publish" -Headers $headers

Write-Host "=== Vietnam Visa Related Articles ==="
foreach ($post in $posts) {
    $title = $post.title.rendered
    if ($title -match "ビザ" -or $title -match "visa" -or $title -match "労働許可") {
        Write-Host ""
        Write-Host "ID: $($post.id)"
        Write-Host "Title: $title"
        Write-Host "Slug: $($post.slug)"
        Write-Host "Link: $($post.link)"
    }
}
