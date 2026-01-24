$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{
    Authorization = "Basic $cred"
    "Content-Type" = "application/json; charset=utf-8"
}

$postIds = @(8128, 8129, 8130, 8131, 8132, 8133, 8134)

foreach ($postId in $postIds) {
    Write-Host "Processing post ID: $postId"

    # Get current content
    $post = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/$postId" -Headers $headers
    $content = $post.content.rendered

    # Remove manual TOC (nav.toc element)
    $pattern = '<nav class="toc">[\s\S]*?</nav>'
    $newContent = $content -replace $pattern, ''

    # Also remove any standalone h2/h3/h4 with just "目次" text
    $newContent = $newContent -replace '<h2[^>]*>\s*目次\s*</h2>', ''
    $newContent = $newContent -replace '<h3[^>]*>\s*目次\s*</h3>', ''
    $newContent = $newContent -replace '<h4[^>]*>\s*目次\s*</h4>', ''

    if ($content -ne $newContent) {
        # Update the post
        $body = @{
            content = $newContent
        } | ConvertTo-Json -Depth 10

        try {
            $response = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/$postId" -Method POST -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType "application/json; charset=utf-8"
            Write-Host "SUCCESS: ID $postId - Manual TOC removed"
        } catch {
            Write-Host "FAILED: ID $postId - Error: $($_.Exception.Message)"
        }
    } else {
        Write-Host "SKIP: ID $postId - No manual TOC found or already removed"
    }
}

Write-Host ""
Write-Host "=== All updates completed ==="
