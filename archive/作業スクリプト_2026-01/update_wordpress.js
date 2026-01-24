const https = require('https');
const fs = require('fs');
const path = require('path');

const API_BASE = 'kyujin.careerlink.asia';
const API_PATH = '/blog/wp-json/wp/v2/posts';
const AUTH = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const DRAFT_FOLDER = 'C:/Users/siank/Desktop/ClaueCode/draft';

// Mapping of file prefixes to post IDs
const mapping = {
    'TH-01': 8113, 'VN-01': 8114, 'TH-02': 8115, 'VN-02': 8116,
    'TH-20': 8117, 'VN-20': 8118, 'TH-03': 8119, 'TH-04': 8120,
    'TH-05': 8121, 'TH-06': 8122, 'VN-03': 8123, 'VN-04': 8124,
    'VN-05': 8125, 'VN-06': 8126, 'TH-14': 8127, 'TH-15': 8128,
    'TH-16': 8129, 'TH-21': 8130, 'TH-25': 8131, 'TH-29': 8132,
    'TH-30': 8133, 'VN-14': 8134, 'VN-15': 8135, 'VN-16': 8136,
    'VN-21': 8137, 'VN-22': 8138, 'VN-26': 8139, 'VN-30': 8140,
    'VN-31': 8141
};

function updatePost(postId, content) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ content: content });

        const options = {
            hostname: API_BASE,
            port: 443,
            path: `${API_PATH}/${postId}`,
            method: 'POST',
            headers: {
                'Authorization': `Basic ${AUTH}`,
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve({ success: true, postId });
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${responseData.substring(0, 200)}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.setTimeout(120000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.write(data);
        req.end();
    });
}

async function findFileForPrefix(prefix) {
    const files = fs.readdirSync(DRAFT_FOLDER);
    return files.find(f => f.startsWith(prefix + '_') && f.endsWith('.html'));
}

async function main() {
    console.log('Starting WordPress update for TOC-removed files...');
    console.log(`Total mappings: ${Object.keys(mapping).length}\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const [prefix, postId] of Object.entries(mapping)) {
        const filename = await findFileForPrefix(prefix);

        if (!filename) {
            console.log(`SKIP: No file found for prefix ${prefix}`);
            continue;
        }

        const filePath = path.join(DRAFT_FOLDER, filename);
        console.log(`Updating post ${postId} from ${filename}...`);

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            await updatePost(postId, content);
            console.log(`  SUCCESS: ID ${postId} updated`);
            successCount++;
        } catch (err) {
            console.log(`  ERROR: ${err.message}`);
            errorCount++;
        }
    }

    console.log('\n==========================================');
    console.log('Update complete!');
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('==========================================');
}

main().catch(console.error);
