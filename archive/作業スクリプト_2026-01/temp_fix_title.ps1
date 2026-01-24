# TH-12 タイトル修正
param()

$ErrorActionPreference = "Stop"

# WordPress API設定
$apiUrl = "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/8318"
$username = "careerlinkasia"
$appPassword = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"

# Base64認証ヘッダー作成
$credentials = "${username}:${appPassword}"
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($credentials))

# リクエストボディをハッシュテーブルで作成
$bodyHash = @{
    title = "タイ日系企業の福利厚生比較2026｜現地採用の待遇完全ガイド"
}
$body = $bodyHash | ConvertTo-Json -Depth 10

# ヘッダー設定
$headers = @{
    Authorization = "Basic $base64Auth"
}

# API呼び出し
try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType "application/json; charset=utf-8"
    Write-Output "SUCCESS"
    Write-Output "ID: $($response.id)"
    Write-Output "Title: $($response.title.rendered)"
}
catch {
    Write-Output "ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        Write-Output $reader.ReadToEnd()
    }
}