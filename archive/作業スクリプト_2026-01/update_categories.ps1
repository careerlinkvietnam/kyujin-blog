$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{
    Authorization = "Basic $cred"
    "Content-Type" = "application/json"
}

# Category mappings:
# 26 = Thai, 25 = Vietnam, 148 = Business, 273 = Recruitment, 158 = Law, 530 = Investment, 28 = Life Info

$updates = @(
    @{id = 8131; categories = @(26, 148, 530)},
    @{id = 8130; categories = @(26, 148, 158, 28)},
    @{id = 8129; categories = @(26, 148, 273, 158)},
    @{id = 8128; categories = @(26, 148, 273, 158)},
    @{id = 8127; categories = @(26, 148, 158)},
    @{id = 8126; categories = @(25, 148, 273)},
    @{id = 8125; categories = @(25, 148, 273)},
    @{id = 8124; categories = @(25, 148, 273)},
    @{id = 8123; categories = @(25, 148, 273)},
    @{id = 8122; categories = @(26, 148, 273)},
    @{id = 8121; categories = @(26, 148, 273)},
    @{id = 8120; categories = @(26, 148, 273)}
)

foreach ($update in $updates) {
    $postId = $update.id
    $categories = $update.categories

    $body = @{
        categories = $categories
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/$postId" -Method POST -Headers $headers -Body $body
        Write-Host "SUCCESS: ID $postId - Categories updated to: $($categories -join ',')"
    } catch {
        Write-Host "FAILED: ID $postId - Error: $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host "=== All updates completed ==="
