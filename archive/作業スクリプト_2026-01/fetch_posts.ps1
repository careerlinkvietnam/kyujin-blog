$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{Authorization = "Basic $cred"}

# Fetch categories first
$categories = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/categories?per_page=100" -Headers $headers
Write-Host "=== CATEGORIES ==="
$categories | ForEach-Object { Write-Host "ID: $($_.id) | Name: $($_.name) | Slug: $($_.slug)" }

Write-Host ""
Write-Host "=== POSTS (Page 1) ==="

# Fetch posts page 1
$posts1 = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts?per_page=100&status=publish&page=1" -Headers $headers
$posts1 | ForEach-Object {
    $catList = if ($_.categories.Count -eq 0 -or ($_.categories.Count -eq 1 -and $_.categories[0] -eq 1)) { "NO_CATEGORY" } else { $_.categories -join "," }
    Write-Host "ID: $($_.id) | Categories: $catList | Title: $($_.title.rendered)"
}

Write-Host ""
Write-Host "=== POSTS (Page 2) ==="

# Fetch posts page 2
try {
    $posts2 = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts?per_page=100&status=publish&page=2" -Headers $headers
    $posts2 | ForEach-Object {
        $catList = if ($_.categories.Count -eq 0 -or ($_.categories.Count -eq 1 -and $_.categories[0] -eq 1)) { "NO_CATEGORY" } else { $_.categories -join "," }
        Write-Host "ID: $($_.id) | Categories: $catList | Title: $($_.title.rendered)"
    }
} catch {
    Write-Host "No more pages"
}
