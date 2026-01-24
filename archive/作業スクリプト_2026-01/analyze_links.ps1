# Analyze internal link structure
$user = "careerlinkasia"
$pass = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${user}:${pass}"))
$headers = @{ Authorization = "Basic $base64Auth" }

# Fetch all published posts
Write-Host "Fetching all posts..." -ForegroundColor Cyan
$allPosts = @()
$page = 1
$perPage = 100

do {
    $url = "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts?per_page=$perPage&page=$page&status=publish"
    try {
        $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
        $allPosts += $response
        $page++
    } catch {
        break
    }
} while ($response.Count -eq $perPage)

Write-Host "Total posts: $($allPosts.Count)" -ForegroundColor Green

# Analyze each post for internal links
$linkAnalysis = @()

foreach ($post in $allPosts) {
    $content = $post.content.rendered
    $title = $post.title.rendered
    $slug = $post.slug
    $id = $post.id

    # Find all internal links to blog posts
    $internalLinks = [regex]::Matches($content, 'href="https://kyujin\.careerlink\.asia/blog/([^"]+)/"')
    $linkCount = $internalLinks.Count
    $linkedSlugs = ($internalLinks | ForEach-Object { $_.Groups[1].Value }) -join ","

    $linkAnalysis += [PSCustomObject]@{
        ID = $id
        Slug = $slug
        Title = $title
        InternalLinkCount = $linkCount
        LinkedSlugs = $linkedSlugs
    }
}

# Sort by link count (ascending - articles with fewest links first)
$linkAnalysis = $linkAnalysis | Sort-Object InternalLinkCount

# Output summary
Write-Host ""
Write-Host "=== Internal Link Analysis ===" -ForegroundColor Cyan
$zeroLinks = ($linkAnalysis | Where-Object { $_.InternalLinkCount -eq 0 }).Count
$fewLinks = ($linkAnalysis | Where-Object { $_.InternalLinkCount -ge 1 -and $_.InternalLinkCount -le 2 }).Count
$goodLinks = ($linkAnalysis | Where-Object { $_.InternalLinkCount -ge 3 }).Count

Write-Host "Articles with 0 internal links: $zeroLinks" -ForegroundColor Yellow
Write-Host "Articles with 1-2 internal links: $fewLinks" -ForegroundColor Yellow
Write-Host "Articles with 3+ internal links: $goodLinks" -ForegroundColor Green

# Show key career/job articles needing links
Write-Host ""
Write-Host "=== Key articles needing internal links ===" -ForegroundColor Cyan
$needLinks = $linkAnalysis | Where-Object {
    $_.InternalLinkCount -lt 3 -and
    ($_.Slug -match 'job|career|guide|thailand|vietnam|salary|visa|work|tax|labor|minimum-wage|recruitment')
} | Select-Object -First 30

$needLinks | ForEach-Object {
    Write-Host "ID:$($_.ID) [$($_.InternalLinkCount) links] $($_.Slug)"
}

# Export full analysis
$linkAnalysis | Export-Csv -Path "link_analysis.csv" -NoTypeInformation -Encoding UTF8
Write-Host ""
Write-Host "Full analysis saved to link_analysis.csv" -ForegroundColor Green
