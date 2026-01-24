Add-Type -AssemblyName System.Web

$file = Get-ChildItem -Path 'C:\Users\siank\Desktop\ClaueCode\draft' -Filter 'TH-13*.html' | Select-Object -First 1
$content = Get-Content -Path $file.FullName -Raw -Encoding UTF8

function Escape-Json($s) {
    $s = $s -replace '\\', '\\\\'
    $s = $s -replace '"', '\"'
    $s = $s -replace "`r`n", '\n'
    $s = $s -replace "`n", '\n'
    $s = $s -replace "`r", '\n'
    $s = $s -replace "`t", '\t'
    return $s
}

$escapedContent = Escape-Json $content
$title = 'タイでリモートワーク求人の探し方2026｜在宅勤務・ハイブリッド勤務完全ガイド'
$escapedTitle = Escape-Json $title
$slug = 'thailand-remote-work-job-guide-2026'

$json = @"
{"title":"$escapedTitle","slug":"$slug","status":"publish","categories":[54],"content":"$escapedContent"}
"@

[System.IO.File]::WriteAllText('C:\Users\siank\Desktop\ClaueCode\th13_upload.json', $json, [System.Text.Encoding]::UTF8)
Write-Host 'JSON file created: th13_upload.json'
Write-Host 'Size:' (Get-Item 'C:\Users\siank\Desktop\ClaueCode\th13_upload.json').Length 'bytes'
