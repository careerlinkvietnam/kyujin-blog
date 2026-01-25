const https = require('https');
const fs = require('fs');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const oldUrl = 'https://kyujin.careerlink.asia/jobseeker/register';
const newUrl = 'https://kyujin.careerlink.asia/register';

function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve({ status: res.statusCode, data: data });
            });
        });
        req.on('error', reject);
        if (postData) {
            req.write(postData);
        }
        req.end();
    });
}

async function getPost(id) {
    const options = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: `/blog/wp-json/wp/v2/posts/${id}?context=edit`,
        method: 'GET',
        headers: { 'Authorization': `Basic ${auth}` }
    };
    return makeRequest(options);
}

async function updatePost(id, content) {
    const postData = JSON.stringify({ content: content });
    const options = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: `/blog/wp-json/wp/v2/posts/${id}`,
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    return makeRequest(options, postData);
}

async function main() {
    console.log('=== Fixing Register URLs ===\n');
    console.log(`Old URL: ${oldUrl}`);
    console.log(`New URL: ${newUrl}\n`);

    // Load posts from backup to find which ones need updating
    const posts = JSON.parse(fs.readFileSync('backup_2026-01-25/all_posts_backup.json', 'utf8'));

    // Find posts with wrong URL
    const postsToFix = posts.filter(post => {
        const content = post.content.raw || post.content.rendered || '';
        return content.includes(oldUrl);
    });

    console.log(`Found ${postsToFix.length} posts to fix\n`);

    let fixed = 0;
    let errors = 0;

    for (let i = 0; i < postsToFix.length; i++) {
        const post = postsToFix[i];
        const title = (post.title.rendered || post.title.raw || 'Untitled').substring(0, 50);

        try {
            // Get fresh content from API
            const getResult = await getPost(post.id);
            if (getResult.status !== 200) {
                console.log(`[${i+1}/${postsToFix.length}] Error getting post ${post.id}: ${getResult.status}`);
                errors++;
                continue;
            }

            const json = JSON.parse(getResult.data);
            let content = json.content.raw;

            // Check if URL still needs fixing
            if (!content.includes(oldUrl)) {
                console.log(`[${i+1}/${postsToFix.length}] Already fixed: ${title}...`);
                continue;
            }

            // Fix the URL
            content = content.split(oldUrl).join(newUrl);

            // Update the post
            const updateResult = await updatePost(post.id, content);
            if (updateResult.status === 200) {
                console.log(`[${i+1}/${postsToFix.length}] Fixed: ${title}...`);
                fixed++;
            } else {
                console.log(`[${i+1}/${postsToFix.length}] Error updating post ${post.id}: ${updateResult.status}`);
                errors++;
            }

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 150));

        } catch (err) {
            console.log(`[${i+1}/${postsToFix.length}] Error: ${title}... - ${err.message}`);
            errors++;
        }
    }

    console.log('\n=== Summary ===');
    console.log(`Total posts checked: ${postsToFix.length}`);
    console.log(`Fixed: ${fixed}`);
    console.log(`Errors: ${errors}`);
}

main().catch(console.error);
