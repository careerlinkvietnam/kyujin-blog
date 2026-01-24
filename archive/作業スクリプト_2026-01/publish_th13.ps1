$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{
    Authorization = "Basic $cred"
    "Content-Type" = "application/json; charset=utf-8"
}

# Find and read TH-13 file
$file = Get-ChildItem -Path 'C:\Users\siank\Desktop\ClaueCode\draft' -Filter 'TH-13*.html' | Select-Object -First 1
$content = Get-Content -Path $file.FullName -Raw -Encoding UTF8

# Create title with UTF8 bytes to avoid encoding issues
$titleBytes = [byte[]]@(227,130,191,227,130,164,227,129,167,227,131,170,227,131,162,227,131,188,227,131,136,227,131,175,227,131,188,227,130,175,230,177,130,228,186,186,227,129,174,230,142,162,227,129,151,230,150,185,50,48,50,54,239,189,156,229,156,168,229,174,133,229,139,164,229,139,153,227,131,187,227,131,143,227,130,164,227,131,150,227,131,170,227,131,131,227,131,137,229,139,164,229,139,153,229,174,140,229,133,168,227,130,172,227,130,164,227,131,137)
$title = [System.Text.Encoding]::UTF8.GetString($titleBytes)

# Create proper JSON using ConvertTo-Json
$body = @{
    title = $title
    slug = 'thailand-remote-work-job-guide-2026'
    status = 'publish'
    categories = @(54)
    content = $content
} | ConvertTo-Json -Depth 10

Write-Host 'JSON created, attempting upload...'

# Create new post using Invoke-WebRequest
try {
    $response = Invoke-WebRequest -Uri 'https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts' -Method POST -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType 'application/json; charset=utf-8' -TimeoutSec 180
    Write-Host 'SUCCESS'
    $result = $response.Content | ConvertFrom-Json
    Write-Host 'ID:' $result.id
    Write-Host 'URL:' $result.link
} catch {
    Write-Host 'FAILED:' $_.Exception.Message
}
