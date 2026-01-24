# Add internal links to key articles
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$user = "careerlinkasia"
$pass = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${user}:${pass}"))
$headers = @{
    Authorization = "Basic $base64Auth"
    "Content-Type" = "application/json; charset=utf-8"
}

# Article slugs
$slugs = @{
    7721 = "thailand-job-complete-guide"
    7726 = "vietnam-job-complete-guide"
    7734 = "bangkok-job-guide"
    7737 = "hanoi-job-guide"
    7735 = "hochiminh-job-guide"
    7710 = "thailand-job-japanese-guide"
    7702 = "vietnam-japanese-company-guide"
    7676 = "thailand-bangkok-living-cost"
    7715 = "vietnam-living-cost-guide"
    8005 = "thailand-visa-work-permit-guide-2026"
    8008 = "thailand-labor-law-employer-guide-2025"
    7997 = "thailand-minimum-wage-guide-2025"
    7998 = "vietnam-labor-law-employer-guide-2026"
    7995 = "vietnam-minimum-wage-2026"
    6992 = "thailand-recruitment-agencies-2026"
    6804 = "vietnam-recruitment-agencies-2026"
    7739 = "overseas-job-agent-comparison"
    7720 = "overseas-salary"
}

# Link map
$linkMap = @{
    7721 = @(7734, 7710, 7676, 8005, 7997, 6992, 7720)
    7726 = @(7737, 7735, 7702, 7715, 7995, 6804, 7720)
    7734 = @(7721, 7676, 8005, 7997, 6992)
    7737 = @(7726, 7715, 7998, 7995, 6804)
    7735 = @(7726, 7715, 7998, 7995, 6804)
    6992 = @(7721, 7734, 7739, 8005)
    6804 = @(7726, 7737, 7735, 7739)
    7739 = @(6992, 6804, 7721, 7726)
    8005 = @(7721, 8008, 7997, 7734)
    7998 = @(7726, 7995, 7737, 7735)
    7997 = @(7721, 8008, 8005, 7734)
    7995 = @(7726, 7998, 7737, 7735)
    7710 = @(7721, 7734, 7676, 8005)
    7702 = @(7726, 7737, 7735, 7715)
    7676 = @(7721, 7734, 7997)
    7715 = @(7726, 7737, 7735, 7995)
}

# Cache for article titles
$titleCache = @{}

function Get-ArticleTitle {
    param($id)

    if ($titleCache.ContainsKey($id)) {
        return $titleCache[$id]
    }

    try {
        $url = "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/$id"
        $article = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
        $titleCache[$id] = $article.title.rendered
        return $article.title.rendered
    } catch {
        return "Article $id"
    }
}

$successCount = 0
$errorCount = 0
$skipCount = 0

foreach ($articleId in $linkMap.Keys) {
    Write-Host "Processing ID:$articleId..." -ForegroundColor Cyan

    # Get current article
    $getUrl = "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/$articleId"
    try {
        $article = Invoke-RestMethod -Uri $getUrl -Headers $headers -Method Get
    } catch {
        Write-Host "  ERROR: Could not fetch" -ForegroundColor Red
        $errorCount++
        continue
    }

    $content = $article.content.rendered
    $articleTitle = $article.title.rendered

    # Skip if already has related links section (check for common patterns)
    if ($content -match '<h2[^>]*>.*?(Related|Kanren|other)' -or $content -match 'class="related"') {
        Write-Host "  SKIP: Already has related section" -ForegroundColor Yellow
        $skipCount++
        continue
    }

    # Build links HTML
    $linkedIds = $linkMap[$articleId]
    $linksHtml = ""

    foreach ($linkId in $linkedIds) {
        if ($slugs.ContainsKey($linkId)) {
            $linkSlug = $slugs[$linkId]
            $linkUrl = "https://kyujin.careerlink.asia/blog/$linkSlug/"
            $linkTitle = Get-ArticleTitle -id $linkId
            $linksHtml += "<li><a href=`"$linkUrl`">$linkTitle</a></li>"
        }
    }

    # Create related section with Japanese heading
    $relatedHtml = "<h2>&#x95A2;&#x9023;&#x8A18;&#x4E8B;</h2><ul>$linksHtml</ul>"

    # Append
    $newContent = $content + $relatedHtml

    # Update
    $updateUrl = "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/$articleId"
    $bodyObj = @{ content = $newContent }
    $body = $bodyObj | ConvertTo-Json -Compress -Depth 10

    try {
        $response = Invoke-RestMethod -Uri $updateUrl -Headers $headers -Method Post -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType "application/json; charset=utf-8"
        Write-Host "  OK: Added $($linkedIds.Count) links" -ForegroundColor Green
        $successCount++
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }

    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
Write-Host "Success: $successCount" -ForegroundColor Green
Write-Host "Skipped: $skipCount" -ForegroundColor Yellow
Write-Host "Errors: $errorCount" -ForegroundColor Red
