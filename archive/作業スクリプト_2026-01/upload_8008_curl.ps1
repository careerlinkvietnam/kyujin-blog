# Read the fixed content and create a JSON file
$content = Get-Content -Path "C:\Users\siank\Desktop\ClaueCode\post_8008.html" -Raw -Encoding UTF8

# Escape the content for JSON
$escapedContent = $content -replace '\\', '\\\\' -replace '"', '\"' -replace "`r`n", '\n' -replace "`n", '\n' -replace "`t", '\t'

# Create the JSON body
$json = "{`"content`":`"$escapedContent`"}"

# Save to file
$json | Out-File -FilePath "C:\Users\siank\Desktop\ClaueCode\update_8008.json" -Encoding UTF8 -NoNewline

Write-Host "JSON file created. Size: $((Get-Item 'C:\Users\siank\Desktop\ClaueCode\update_8008.json').Length) bytes"
