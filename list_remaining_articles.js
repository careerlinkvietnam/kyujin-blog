const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('backup_2026-01-25/all_posts_backup.json'));

// Completed articles
const completed = [7726, 7998, 8009];

// Filter out completed ones
const remaining = posts.filter(p => !completed.includes(p.id));

console.log('Total posts:', posts.length);
console.log('Completed:', completed.length);
console.log('Remaining:', remaining.length);
console.log('');

// Show first 30 remaining articles with their titles
console.log('=== 未処理記事（最初の30件） ===');
remaining.slice(0, 30).forEach(p => {
    const title = p.title.rendered;
    // Determine country
    let country = '他';
    if (title.includes('ベトナム') || title.includes('Vietnam') || title.includes('ホーチミン') || title.includes('ハノイ')) country = 'VN';
    if (title.includes('タイ') || title.includes('Thailand') || title.includes('バンコク')) country = 'TH';
    if (title.includes('インドネシア') || title.includes('Indonesia') || title.includes('ジャカルタ')) country = 'ID';
    if (title.includes('東南アジア')) country = 'SEA';

    // Determine target
    let target = '?';
    if (title.includes('転職') || title.includes('求人') || title.includes('就職') || title.includes('働く')) target = '求職者';
    if (title.includes('採用') || title.includes('人事') || title.includes('経営') || title.includes('企業') || title.includes('投資') || title.includes('法人')) target = '企業';

    console.log(p.id, '|', country, '|', target, '|', title.substring(0, 50));
});
