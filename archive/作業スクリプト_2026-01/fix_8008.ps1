$username = "careerlinkasia"
$password = "N2Zz bzSn AWve Pa83 Ap2S 6Mlw"
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{Authorization = "Basic $cred"}

# Get current post content
$post = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/8008" -Headers $headers
$content = $post.content.rendered

# Fix 1: Change maternity leave from 105 days to 120 days
$content = $content -replace "105日", "120日"

# Fix 2: Change social security benefit period from 45 days to 60 days
$content = $content -replace "残り45日分", "残り60日分"
$content = $content -replace "残りの45日分", "残りの60日分"
$content = $content -replace "産休中の45日間は", "産休中の60日間は"
$content = $content -replace "45日分（給与の50%）", "60日分（給与の50%）"
$content = $content -replace "給与の50%を45日分", "給与の50%を60日分"

# Fix 3: Fix the paternity leave section - replace the old "under consideration" text with actual enacted law
$oldPaternityText = '<div style="background: #e8f5e9; border: 1px solid #4caf50; border-radius: 8px; padding: 20px; margin: 20px 0;">' + "`n" + '<h4 style="color: #2e7d32; margin: 0 0 10px 0;">将来的な制度変更</h4>' + "`n" + '<p style="margin: 0;">タイ政府は<strong>父親の育児休暇（Paternity Leave）</strong>の導入を検討しています。現時点では法定義務ではありませんが、先進的な企業では自主的に導入するケースが増えています。福利厚生の一環として検討することをおすすめします。</p>' + "`n" + '</div>'

$newPaternityText = @"
<h3>父親の育児休暇（Paternity Leave）</h3>
<p>2025年12月の法改正により、<strong>父親の育児休暇（配偶者出産休暇）</strong>が法定義務となりました。</p>
<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
<thead>
<tr style="background: #f8f9fa;">
<th style="border: 1px solid #ddd; padding: 12px; text-align: left;">項目</th>
<th style="border: 1px solid #ddd; padding: 12px; text-align: left;">内容</th>
</tr>
</thead>
<tbody>
<tr>
<td style="border: 1px solid #ddd; padding: 12px;"><strong>休暇日数</strong></td>
<td style="border: 1px solid #ddd; padding: 12px;">15日間</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 12px;"><strong>給与</strong></td>
<td style="border: 1px solid #ddd; padding: 12px;">全額有給（雇用主負担）</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 12px;"><strong>取得期間</strong></td>
<td style="border: 1px solid #ddd; padding: 12px;">出産前または出産後90日以内</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 12px;"><strong>取得方法</strong></td>
<td style="border: 1px solid #ddd; padding: 12px;">連続または分割して取得可能</td>
</tr>
</tbody>
</table>
<h3>新生児ケア休暇（追加15日）</h3>
<p>新生児に健康上の問題がある場合、<strong>追加で15日間の休暇</strong>を取得できます。</p>
<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
<thead>
<tr style="background: #f8f9fa;">
<th style="border: 1px solid #ddd; padding: 12px; text-align: left;">項目</th>
<th style="border: 1px solid #ddd; padding: 12px; text-align: left;">内容</th>
</tr>
</thead>
<tbody>
<tr>
<td style="border: 1px solid #ddd; padding: 12px;"><strong>対象</strong></td>
<td style="border: 1px solid #ddd; padding: 12px;">新生児に医療リスク、異常、障害がある場合</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 12px;"><strong>休暇日数</strong></td>
<td style="border: 1px solid #ddd; padding: 12px;">15日間（産休120日に追加）</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 12px;"><strong>給与</strong></td>
<td style="border: 1px solid #ddd; padding: 12px;">通常給与の50%</td>
</tr>
<tr>
<td style="border: 1px solid #ddd; padding: 12px;"><strong>必要書類</strong></td>
<td style="border: 1px solid #ddd; padding: 12px;">医師の診断書</td>
</tr>
</tbody>
</table>
<div style="background: #e8f5e9; border: 1px solid #4caf50; border-radius: 8px; padding: 20px; margin: 20px 0;">
<h4 style="color: #2e7d32; margin: 0 0 10px 0;">2025年12月改正のポイント</h4>
<p style="margin: 0;">今回の改正で、タイは東南アジアの中でも<strong>育児支援制度が充実した国</strong>となりました。経営者は、産休120日・父親育休15日・新生児ケア休暇15日の制度を正しく理解し、就業規則を更新してください。</p>
</div>
"@

$content = $content -replace [regex]::Escape($oldPaternityText), $newPaternityText

# Fix 4: Update summary table if exists
$content = $content -replace "98日→105日", "98日→120日"

# Fix 5: Fix the intro section mentioning paternity leave
$content = $content -replace "父親の育児休暇</strong></td>`n<td style=`"border: 1px solid #ddd; padding: 12px; color: #388e3c; font-weight: bold;`">検討中（将来的に導入予定）", "父親の育児休暇</strong></td>`n<td style=`"border: 1px solid #ddd; padding: 12px; color: #388e3c; font-weight: bold;`">15日間（有給）"

# Save to file for verification
$content | Out-File -FilePath "C:\Users\siank\Desktop\ClaueCode\post_8008_fixed.html" -Encoding UTF8
Write-Host "Fixed content saved to post_8008_fixed.html for verification"

# Create JSON body for update
$body = @{
    content = $content
} | ConvertTo-Json -Depth 10

# Update the post
try {
    $response = Invoke-RestMethod -Uri "https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/8008" -Method POST -Headers $headers -Body $body -ContentType "application/json; charset=utf-8"
    Write-Host "SUCCESS: Post 8008 updated"
    Write-Host "Title: $($response.title.rendered)"
} catch {
    Write-Host "FAILED: $($_.Exception.Message)"
}
