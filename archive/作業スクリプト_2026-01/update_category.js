const https = require('https');

// コマンドライン引数
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node update_category.js <post_id> <category_ids>');
    console.log('Example: node update_category.js 8138 25,148,530');
    process.exit(1);
}

const postId = args[0];
const categoryIds = args[1].split(',').map(id => parseInt(id.trim()));

// WordPress API設定
const apiUrl = 'kyujin.careerlink.asia';
const apiPath = `/blog/wp-json/wp/v2/posts/${postId}`;
const username = 'careerlinkasia';
const appPassword = 'N2Zz bzSn AWve Pa83 Ap2S 6Mlw';

// Base64認証
const auth = Buffer.from(`${username}:${appPassword}`).toString('base64');

// リクエストボディ
const postData = JSON.stringify({
    categories: categoryIds
});

// リクエストオプション
const options = {
    hostname: apiUrl,
    port: 443,
    path: apiPath,
    method: 'POST',
    headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData)
    }
};

// リクエスト送信
const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            const response = JSON.parse(data);
            console.log('SUCCESS - ID:', response.id, 'Categories:', JSON.stringify(response.categories));
        } else {
            console.log('ERROR: Status', res.statusCode);
            console.log(data);
        }
    });
});

req.on('error', (e) => {
    console.error('ERROR:', e.message);
});

req.write(postData);
req.end();
