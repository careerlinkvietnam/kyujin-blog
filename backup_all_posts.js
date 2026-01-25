const https = require('https');
const fs = require('fs');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

async function fetchPosts(page = 1, allPosts = []) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'kyujin.careerlink.asia',
            port: 443,
            path: `/blog/wp-json/wp/v2/posts?per_page=100&page=${page}&context=edit`,
            method: 'GET',
            headers: { 'Authorization': `Basic ${auth}` }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const posts = JSON.parse(data);
                    allPosts = allPosts.concat(posts);
                    console.log(`Page ${page}: fetched ${posts.length} posts (total: ${allPosts.length})`);

                    if (posts.length === 100) {
                        // More pages available
                        resolve(fetchPosts(page + 1, allPosts));
                    } else {
                        resolve(allPosts);
                    }
                } else {
                    console.log(`Page ${page}: Status ${res.statusCode}`);
                    resolve(allPosts);
                }
            });
        });

        req.on('error', (e) => {
            console.error('Error:', e.message);
            resolve(allPosts);
        });

        req.end();
    });
}

async function main() {
    console.log('Starting backup of all posts...\n');

    const posts = await fetchPosts();

    console.log(`\nTotal posts fetched: ${posts.length}`);

    // Create backup directory
    const backupDir = 'backup_' + new Date().toISOString().split('T')[0];
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }

    // Save all posts to a single JSON file
    const backupFile = `${backupDir}/all_posts_backup.json`;
    fs.writeFileSync(backupFile, JSON.stringify(posts, null, 2));
    console.log(`\nBackup saved to: ${backupFile}`);

    // Also save a summary
    const summary = posts.map(p => ({
        id: p.id,
        title: p.title.rendered || p.title.raw,
        date: p.date,
        link: p.link,
        content_length: (p.content.raw || p.content.rendered || '').length
    }));

    const summaryFile = `${backupDir}/posts_summary.json`;
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`Summary saved to: ${summaryFile}`);

    console.log('\nBackup complete!');
}

main();
