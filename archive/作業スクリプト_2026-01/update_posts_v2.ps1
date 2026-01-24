# TOC removed files update script v2
# Uses dynamic file detection

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# WordPress API settings
$apiBase = "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts"
$username = "careerlinkasia"
$appPassword = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"

# Base64 auth header
$credentials = "${username}:${appPassword}"
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($credentials))
$headers = @{
    Authorization = "Basic $base64Auth"
}

$draftFolder = "C:\Users\siank\Desktop\ClaueCode\draft"

# Define mapping using file prefix to post ID
$prefixMapping = @{
    "TH-01" = 8113
    "VN-01" = 8114
    "TH-02" = 8115
    "VN-02" = 8116
    "TH-20" = 8117
    "VN-20" = 8118
    "TH-03" = 8119
    "TH-04" = 8120
    "TH-05" = 8121
    "TH-06" = 8122
    "VN-03" = 8123
    "VN-04" = 8124
    "VN-05" = 8125
    "VN-06" = 8126
    "TH-14" = 8127
    "TH-15" = 8128
    "TH-16" = 8129
    "TH-21" = 8130
    "TH-25" = 8131
    "TH-29" = 8132
    "TH-30" = 8133
    "VN-14" = 8134
    "VN-15" = 8135
    "VN-16" = 8136
    "VN-21" = 8137
    "VN-22" = 8138
    "VN-26" = 8139
    "VN-30" = 8140
    "VN-31" = 8141
}

$successCount = 0
$errorCount = 0

Write-Output "Starting WordPress update for TOC-removed files..."
Write-Output "Total mappings: $($prefixMapping.Count)"
Write-Output ""

foreach ($prefix in $prefixMapping.Keys) {
    $postId = $prefixMapping[$prefix]

    # Find file matching prefix
    $matchingFiles = Get-ChildItem -Path $draftFolder -Filter "${prefix}_*.html"

    if ($matchingFiles.Count -eq 0) {
        Write-Output "SKIP: No file found for prefix $prefix"
        continue
    }

    $filePath = $matchingFiles[0].FullName
    $fileName = $matchingFiles[0].Name

    Write-Output "Updating post $postId from $fileName..."

    try {
        # Read HTML content
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8

        # Create request body
        $bodyHash = @{
            content = $content
        }
        $body = $bodyHash | ConvertTo-Json -Depth 10 -Compress

        # API call to update post
        $apiUrl = "$apiBase/$postId"
        $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType "application/json; charset=utf-8"

        Write-Output "  SUCCESS: ID $postId updated"
        $successCount++
    }
    catch {
        Write-Output "  ERROR: $($_.Exception.Message)"
        $errorCount++
    }
}

Write-Output ""
Write-Output "=========================================="
Write-Output "Update complete!"
Write-Output "Success: $successCount"
Write-Output "Errors: $errorCount"
Write-Output "=========================================="
