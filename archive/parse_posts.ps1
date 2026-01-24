[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$posts = Get-Content -Encoding UTF8 'C:\Users\siank\Desktop\ClaueCode\existing_posts_page1.json' | ConvertFrom-Json
foreach ($post in $posts) {
    Write-Output "$($post.id)|$($post.slug)|$($post.title.rendered)"
}
