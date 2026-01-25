const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('backup_2026-01-25/all_posts_backup.json', 'utf8'));

// Find Vietnam-focused articles (求職者向け, longer articles)
const vietnamPosts = posts.filter(post => {
    const title = (post.title.rendered || post.title.raw || '').toLowerCase();
    const content = post.content.raw || post.content.rendered || '';
    const contentLength = content.length;

    // Vietnam focused in title
    const isVietnam = title.includes('ベトナム') || title.includes('vietnam') ||
                      title.includes('ホーチミン') || title.includes('ハノイ');

    // Long article (good for multiple CTAs)
    const isLong = contentLength > 20000;

    // 転職/求職者向け
    const isJobseeker = title.includes('転職') || title.includes('求人') ||
                        title.includes('就職') || title.includes('働く');

    return isVietnam && isLong && isJobseeker;
}).map(p => ({
    id: p.id,
    title: (p.title.rendered || p.title.raw || '').substring(0, 60),
    length: (p.content.raw || p.content.rendered || '').length,
    date: p.date
})).sort((a, b) => b.length - a.length);

console.log('ベトナム求職者向け長文記事（文字数順）:\n');
vietnamPosts.slice(0, 15).forEach((p, i) => {
    console.log(`${i+1}. ID:${p.id} (${p.length.toLocaleString()}文字) - ${p.title}`);
});
