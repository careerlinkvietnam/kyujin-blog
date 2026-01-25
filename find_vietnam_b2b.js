const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('backup_2026-01-25/all_posts_backup.json', 'utf8'));

// Find Vietnam B2B articles
const b2bPosts = posts.filter(post => {
    const title = (post.title.rendered || post.title.raw || '').toLowerCase();
    const content = post.content.raw || post.content.rendered || '';
    const contentLength = content.length;

    // Vietnam focused
    const isVietnam = title.includes('ベトナム') || title.includes('vietnam');

    // B2B focused keywords in title
    const isB2B = title.includes('採用') || title.includes('人材') ||
                  title.includes('企業') || title.includes('雇用') ||
                  title.includes('労働法') || title.includes('解雇') ||
                  title.includes('社会保険') || title.includes('退職金') ||
                  title.includes('法人税') || title.includes('人事');

    return isVietnam && isB2B && contentLength > 10000;
}).map(p => ({
    id: p.id,
    title: (p.title.rendered || p.title.raw || '').substring(0, 60),
    length: (p.content.raw || p.content.rendered || '').length,
    date: p.date
})).sort((a, b) => b.length - a.length);

console.log('ベトナム企業向け（B2B）記事（文字数順）:\n');
b2bPosts.slice(0, 15).forEach((p, i) => {
    console.log(`${i+1}. ID:${p.id} (${p.length.toLocaleString()}文字) - ${p.title}`);
});
