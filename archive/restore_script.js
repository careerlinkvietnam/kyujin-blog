const fs = require('fs');

const data = JSON.parse(fs.readFileSync('backups/articles/ベトナム人材紹介会社_v1_2024-02-26.json', 'utf-8'));

const restore = {
    title: data.title.raw,
    content: data.content.raw,
    excerpt: data.excerpt.raw
};

fs.writeFileSync('restore_ベトナム人材紹介会社.json', JSON.stringify(restore), 'utf-8');

console.log('Restore file created successfully');
