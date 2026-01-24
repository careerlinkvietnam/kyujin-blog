$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{Authorization = "Basic $cred"}

Write-Host "=== Checking for manual TOC in published posts ==="
Write-Host ""

# Check page 1
$posts1 = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts?per_page=100&status=publish&page=1" -Headers $headers

foreach ($post in $posts1) {
    $content = $post.content.rendered
    # Check for manual TOC patterns
    if ($content -match '<h2[^>]*>.*?目次.*?</h2>' -or $content -match '<h3[^>]*>.*?目次.*?</h3>' -or $content -match '<h4[^>]*>.*?目次.*?</h4>' -or $content -match '<nav[^>]*class=[^>]*toc[^>]*>') {
        Write-Host "FOUND TOC: ID $($post.id) - $($post.title.rendered)"
    }
}

# Check page 2
try {
    $posts2 = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts?per_page=100&status=publish&page=2" -Headers $headers
    foreach ($post in $posts2) {
        $content = $post.content.rendered
        if ($content -match '<h2[^>]*>.*?目次.*?</h2>' -or $content -match '<h3[^>]*>.*?目次.*?</h3>' -or $content -match '<h4[^>]*>.*?目次.*?</h4>' -or $content -match '<nav[^>]*class=[^>]*toc[^>]*>') {
            Write-Host "FOUND TOC: ID $($post.id) - $($post.title.rendered)"
        }
    }
} catch {
    # No more pages
}

Write-Host ""
Write-Host "=== Check completed ==="
