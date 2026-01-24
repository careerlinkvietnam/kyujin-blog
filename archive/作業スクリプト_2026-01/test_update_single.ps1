# Test single post update
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$apiBase = "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts"
$username = "careerlinkasia"
$appPassword = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$credentials = "${username}:${appPassword}"
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($credentials))

$draftFolder = "C:\Users\siank\Desktop\ClaueCode\draft"

# Find TH-03 file
$file = Get-ChildItem -Path $draftFolder -Filter "TH-03_*.html" | Select-Object -First 1
$postId = 8119

Write-Output "Testing update for post $postId from $($file.Name)..."
Write-Output "File size: $($file.Length) bytes"

# Read content
$content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
Write-Output "Content length: $($content.Length) chars"

# Prepare body
$bodyHash = @{ content = $content }
$body = $bodyHash | ConvertTo-Json -Depth 10 -Compress
Write-Output "JSON body length: $($body.Length) chars"

# API call
Write-Output "Sending API request..."
$headers = @{ Authorization = "Basic $base64Auth" }
$apiUrl = "$apiBase/$postId"

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType "application/json; charset=utf-8" -TimeoutSec 120
    Write-Output "SUCCESS: Post $postId updated"
    Write-Output "Response ID: $($response.id)"
}
catch {
    Write-Output "ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        Write-Output "Response body: $($reader.ReadToEnd())"
    }
}
