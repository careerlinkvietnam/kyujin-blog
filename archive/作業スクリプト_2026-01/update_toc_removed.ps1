# TOC removed files update script
# Updates WordPress posts with TOC-removed content

$ErrorActionPreference = "Stop"

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

# Mapping of draft files to WordPress post IDs
$mapping = @{
    # SS Priority (6 files)
    "TH-01_タイ日系企業ランキング2026.html" = 8113
    "VN-01_ベトナム日系企業ランキング2026.html" = 8114
    "TH-02_タイ製造業求人完全ガイド.html" = 8115
    "VN-02_ベトナム製造業求人完全ガイド.html" = 8116
    "TH-20_タイ個人所得税完全ガイド2026.html" = 8117
    "VN-20_ベトナム個人所得税完全ガイド2026.html" = 8118

    # S Priority - Job types (8 files)
    "TH-03_タイIT求人エンジニア転職ガイド.html" = 8119
    "TH-04_タイ営業職求人ガイド.html" = 8120
    "TH-05_タイ経理会計求人ガイド.html" = 8121
    "TH-06_タイ人事総務求人ガイド.html" = 8122
    "VN-03_ベトナムIT求人エンジニア転職ガイド.html" = 8123
    "VN-04_ベトナム営業職求人ガイド.html" = 8124
    "VN-05_ベトナム経理会計求人ガイド.html" = 8125
    "VN-06_ベトナム人事総務求人ガイド.html" = 8126

    # S Priority - Visa/Labor/Insurance/Education (14 files)
    "TH-14_タイBビザ申請方法2026.html" = 8127
    "TH-15_タイ解雇規定完全解説.html" = 8128
    "TH-16_タイ退職金制度完全解説.html" = 8129
    "TH-21_タイ社会保険制度解説.html" = 8130
    "TH-25_タイ経済2026年見通し.html" = 8131
    "TH-29_タイ日本人学校完全ガイド.html" = 8132
    "TH-30_タイインターナショナルスクールガイド.html" = 8133
    "VN-14_ベトナム就労ビザ申請方法2026.html" = 8134
    "VN-15_ベトナム解雇規定完全解説.html" = 8135
    "VN-16_ベトナム退職金制度完全解説.html" = 8136
    "VN-21_ベトナム社会保険制度解説.html" = 8137
    "VN-22_ベトナム投資優遇制度2026.html" = 8138
    "VN-26_ベトナム南北経済回廊と産業動向.html" = 8139
    "VN-30_ベトナム日本人学校完全ガイド.html" = 8140
    "VN-31_ベトナムインターナショナルスクールガイド.html" = 8141
}

$draftFolder = "C:\Users\siank\Desktop\ClaueCode\draft"
$successCount = 0
$errorCount = 0

Write-Output "Starting WordPress update for TOC-removed files..."
Write-Output "Total files to update: $($mapping.Count)"
Write-Output ""

foreach ($file in $mapping.Keys) {
    $postId = $mapping[$file]
    $filePath = Join-Path $draftFolder $file

    if (-not (Test-Path $filePath)) {
        Write-Output "SKIP: $file - File not found"
        continue
    }

    Write-Output "Updating post $postId from $file..."

    try {
        # Read HTML content
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8

        # Create request body (only update content)
        $bodyHash = @{
            content = $content
        }
        $body = $bodyHash | ConvertTo-Json -Depth 10

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
