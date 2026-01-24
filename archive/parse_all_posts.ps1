$OutputEncoding = [System.Text.Encoding]::UTF8
$output = @()

$posts1 = Get-Content -Encoding UTF8 'C:\Users\siank\Desktop\ClaueCode\existing_posts_page1.json' | ConvertFrom-Json
foreach ($post in $posts1) {
    $output += "$($post.id)|$($post.slug)|$($post.title.rendered)"
}

$posts2 = Get-Content -Encoding UTF8 'C:\Users\siank\Desktop\ClaueCode\existing_posts_page2.json' | ConvertFrom-Json
foreach ($post in $posts2) {
    $output += "$($post.id)|$($post.slug)|$($post.title.rendered)"
}

$posts3 = Get-Content -Encoding UTF8 'C:\Users\siank\Desktop\ClaueCode\existing_posts_page3.json' | ConvertFrom-Json
foreach ($post in $posts3) {
    $output += "$($post.id)|$($post.slug)|$($post.title.rendered)"
}

$output | Out-File -Encoding UTF8 'C:\Users\siank\Desktop\ClaueCode\existing_posts_list.txt'
Write-Output "Total posts: $($output.Count)"
