const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('backup_2026-01-25/all_posts_backup.json', 'utf8'));

console.log('=== レガシーCTAを含む記事 ===\n');

// ベトナム版レガシーCTA
const vnLegacy = posts.filter(p => (p.content.raw||'').includes('ベトナムで働くことに興味はありませんか'));
console.log('ベトナム版レガシーCTA:', vnLegacy.length, '記事');
vnLegacy.forEach(p => console.log('  ID:', p.id, '-', (p.title.rendered||'').substring(0,50)));

console.log('');

// タイ版レガシーCTA
const thLegacy = posts.filter(p => (p.content.raw||'').includes('タイで働くことに興味はありませんか'));
console.log('タイ版レガシーCTA:', thLegacy.length, '記事');
thLegacy.forEach(p => console.log('  ID:', p.id, '-', (p.title.rendered||'').substring(0,50)));

console.log('');

// 求人を探すならセクション
const jobSearchSection = posts.filter(p => {
    const c = p.content.raw || '';
    return c.includes('の求人を探すなら</h2>');
});
console.log('「求人を探すなら」セクション:', jobSearchSection.length, '記事');
jobSearchSection.forEach(p => console.log('  ID:', p.id, '-', (p.title.rendered||'').substring(0,50)));
