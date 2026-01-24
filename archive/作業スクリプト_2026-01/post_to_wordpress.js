const fs = require('fs');
const https = require('https');
const path = require('path');

// コマンドライン引数
const args = process.argv.slice(2);
if (args.length < 3) {
    console.log('Usage: node post_to_wordpress.js <filepath> <title> <slug>');
    process.exit(1);
}

const [filePath, title, slug] = args;

// WordPress API設定
const apiUrl = 'kyujin.careerlink.asia';
const apiPath = '/blog/wp-json/wp/v2/posts';
const username = 'careerlinkasia';
const appPassword = 'N2Zz bzSn AWve Pa83 Ap2S 6Mlw';

// Base64認証
const auth = Buffer.from(`${username}:${appPassword}`).toString('base64');

// HTMLコンテンツ読み込み
const content = fs.readFileSync(filePath, 'utf8');

// リクエストボディ
const postData = JSON.stringify({
    title: title,
    slug: slug,
    status: 'publish',
    categories: [25],
    content: content
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
        if (res.statusCode === 201) {
            const response = JSON.parse(data);
            console.log('SUCCESS');
            console.log('ID:', response.id);
            console.log('URL:', response.link);
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
