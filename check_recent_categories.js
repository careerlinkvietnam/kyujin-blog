const https = require('https');

const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const options = {
    hostname: 'kyujin.careerlink.asia',
    path: '/blog/wp-json/wp/v2/posts?per_page=20&orderby=date&order=desc&_fields=id,title,categories,date',
    method: 'GET',
    headers: {
        'Authorization': AUTH
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const posts = JSON.parse(data);
            console.log('=== 直近20記事のカテゴリー設定状況 ===\n');

            const categoryMap = {
                25: 'ベトナム', 26: 'タイ', 148: 'ビジネス', 158: '法律',
                273: '採用・雇用', 530: '投資', 28: '生活情報', 14: 'ハノイ',
                4: 'ホーチミン', 15: 'バンコク', 219: 'チェンマイ', 141: 'ダナン',
                372: 'マレーシア', 373: 'インドネシア', 374: 'フィリピン', 368: 'シンガポール'
            };

            let noCategory = [];

            posts.forEach((post, index) => {
                const title = post.title.rendered;
                const cats = post.categories;
                const catNames = cats.map(c => categoryMap[c] || `ID:${c}`).join(', ') || 'なし';
                const hasCategory = cats.length > 0 && !cats.every(c => c === 1); // 1 = 未分類

                const status = hasCategory ? '✅' : '❌';
                console.log(`${index + 1}. [${status}] ID:${post.id} | カテゴリー: [${catNames}]`);
                console.log(`   ${title.substring(0, 50)}...`);
                console.log(`   公開日: ${post.date.split('T')[0]}`);
                console.log('');

                if (!hasCategory || cats.includes(1)) {
                    noCategory.push({ id: post.id, title: title });
                }
            });

            console.log('=== サマリー ===');
            console.log(`カテゴリー未設定/未分類のみ: ${noCategory.length}件`);
            if (noCategory.length > 0) {
                console.log('\n要対応:');
                noCategory.forEach(p => {
                    console.log(`  - ID:${p.id}: ${p.title.substring(0, 40)}...`);
                });
            }
        } catch (e) {
            console.log('Parse Error:', e.message);
            console.log('Response:', data);
        }
    });
});

req.on('error', (e) => {
    console.log('Request Error:', e.message);
});

req.end();
