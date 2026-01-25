const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('backup_2026-01-25/all_posts_backup.json'));

// Completed articles
const completed = [7726, 7998, 8009, 8574, 8573, 8564, 8563, 8538, 8537, 8534, 8529, 8528, 8527];

// Filter for January 2026
const jan2026 = posts.filter(p => {
    const date = new Date(p.date);
    return date.getFullYear() === 2026 && date.getMonth() === 0; // January = 0
});

console.log('2026年1月掲載の記事:', jan2026.length, '件');
console.log('');

// Check completed vs remaining
const jan2026Completed = jan2026.filter(p => completed.includes(p.id));
const jan2026Remaining = jan2026.filter(p => !completed.includes(p.id));

console.log('完了:', jan2026Completed.length, '件');
console.log('残り:', jan2026Remaining.length, '件');
console.log('');

// List remaining
console.log('=== 残りの記事 ===');
jan2026Remaining.forEach(p => {
    const title = p.title.rendered;
    let country = '他';
    if (title.includes('ベトナム') || title.includes('ホーチミン') || title.includes('ハノイ')) country = 'VN';
    if (title.includes('タイ') || title.includes('バンコク')) country = 'TH';
    if (title.includes('インドネシア')) country = 'ID';
    if (title.includes('東南アジア') || title.includes('海外')) country = 'SEA';

    let target = '?';
    if (title.includes('転職') || title.includes('求人') || title.includes('就職') || title.includes('働く')) target = '求職者';
    if (title.includes('採用') || title.includes('人事') || title.includes('企業') || title.includes('投資') || title.includes('ビジネス') || title.includes('経営')) target = '企業';

    console.log(p.id, '|', country, '|', target, '|', title.substring(0, 45));
});
