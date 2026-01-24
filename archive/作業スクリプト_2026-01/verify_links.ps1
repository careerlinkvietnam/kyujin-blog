# Verify internal links were added
$testUrl = "https://kyujin.careerlink.asia/blog/thailand-job-complete-guide/"

Write-Host "Checking: $testUrl" -ForegroundColor Cyan

$response = Invoke-WebRequest -Uri $testUrl -UseBasicParsing
$content = $response.Content

# Count internal blog links
$links = [regex]::Matches($content, 'href="https://kyujin\.careerlink\.asia/blog/([^"]+)/"')
Write-Host "Total internal blog links: $($links.Count)" -ForegroundColor Green

# Check for related section (Japanese: kanren kiji)
if ($content -match '&#x95A2;&#x9023;&#x8A18;&#x4E8B;' -or $content -match 'class="related"') {
    Write-Host "Related section HTML entity found!" -ForegroundColor Green
}

# Show unique linked slugs
$slugs = $links | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
Write-Host "`nLinked articles:" -ForegroundColor Yellow
$slugs | ForEach-Object { Write-Host "  - $_" }
