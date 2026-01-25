const https = require('https');
const fs = require('fs');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// Define standardized tags to create
const standardTags = [
    // Country tags
    { name: 'タイ', slug: 'thailand' },
    { name: 'ベトナム', slug: 'vietnam' },
    { name: 'インドネシア', slug: 'indonesia' },
    { name: '東南アジア', slug: 'southeast-asia' },

    // Target audience tags
    { name: '求職者向け', slug: 'for-jobseekers' },
    { name: '企業・採用担当者向け', slug: 'for-employers' },

    // Topic tags
    { name: '給与・年収', slug: 'salary' },
    { name: 'ビザ・労働許可', slug: 'visa-work-permit' },
    { name: '税金', slug: 'tax' },
    { name: '労働法', slug: 'labor-law' },
    { name: '生活情報', slug: 'living' },

    // Industry tags
    { name: '製造業', slug: 'manufacturing' },
    { name: 'IT・エンジニア', slug: 'it-engineer' },
    { name: '営業', slug: 'sales' },
    { name: '経理・会計', slug: 'accounting' },
    { name: '人事・総務', slug: 'hr-admin' }
];

// API helper functions
function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    reject({ status: res.statusCode, data: data });
                }
            });
        });
        req.on('error', reject);
        if (postData) {
            req.write(postData);
        }
        req.end();
    });
}

async function fetchExistingTags() {
    const options = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/tags?per_page=100',
        method: 'GET',
        headers: { 'Authorization': `Basic ${auth}` }
    };
    return makeRequest(options);
}

async function createTag(name, slug) {
    const postData = JSON.stringify({ name, slug });
    const options = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/tags',
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    return makeRequest(options, postData);
}

async function updatePostTags(postId, tagIds) {
    const postData = JSON.stringify({ tags: tagIds });
    const options = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: `/blog/wp-json/wp/v2/posts/${postId}`,
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    return makeRequest(options, postData);
}

// Analysis functions
function analyzePost(post) {
    const title = (post.title.rendered || post.title.raw || '').toLowerCase();
    const content = (post.content.raw || post.content.rendered || '').toLowerCase();
    const text = title + ' ' + content;

    const matchedTags = [];

    // Country detection
    if (text.includes('タイ') || text.includes('thailand') || text.includes('バンコク') || text.includes('bangkok') || text.includes('チェンマイ')) {
        matchedTags.push('thailand');
    }
    if (text.includes('ベトナム') || text.includes('vietnam') || text.includes('ホーチミン') || text.includes('ハノイ') || text.includes('ダナン')) {
        matchedTags.push('vietnam');
    }
    if (text.includes('インドネシア') || text.includes('indonesia') || text.includes('ジャカルタ')) {
        matchedTags.push('indonesia');
    }
    if (text.includes('東南アジア') || text.includes('southeast asia') || text.includes('asean') || text.includes('アセアン')) {
        matchedTags.push('southeast-asia');
    }

    // Target audience detection
    if (text.includes('転職') || text.includes('求職') || text.includes('働きたい方') || text.includes('海外就職') || text.includes('海外転職')) {
        matchedTags.push('for-jobseekers');
    }
    if (text.includes('人事') || text.includes('採用担当') || text.includes('経営者') || text.includes('企業向け') || text.includes('採用') && text.includes('ポイント')) {
        matchedTags.push('for-employers');
    }

    // Topic detection
    if (text.includes('給与') || text.includes('年収') || text.includes('給料') || text.includes('salary') || text.includes('賃金')) {
        matchedTags.push('salary');
    }
    if (text.includes('ビザ') || text.includes('visa') || text.includes('労働許可') || text.includes('work permit') || text.includes('ワークパーミット')) {
        matchedTags.push('visa-work-permit');
    }
    if (text.includes('税金') || text.includes('所得税') || text.includes('tax') || text.includes('確定申告')) {
        matchedTags.push('tax');
    }
    if (text.includes('労働法') || text.includes('労働保護') || text.includes('labor law') || text.includes('労働基準')) {
        matchedTags.push('labor-law');
    }
    if (text.includes('生活費') || text.includes('生活') || text.includes('住居') || text.includes('living') || text.includes('物価') || text.includes('家賃')) {
        matchedTags.push('living');
    }

    // Industry detection
    if (text.includes('製造') || text.includes('工場') || text.includes('manufacturing') || text.includes('生産管理')) {
        matchedTags.push('manufacturing');
    }
    if ((text.includes('it') && (text.includes('業界') || text.includes('エンジニア') || text.includes('求人'))) ||
        text.includes('エンジニア') || text.includes('プログラマ') || text.includes('システム開発') || text.includes('プログラミング')) {
        matchedTags.push('it-engineer');
    }
    if (text.includes('営業') || text.includes('sales') || text.includes('セールス')) {
        matchedTags.push('sales');
    }
    if (text.includes('経理') || text.includes('会計') || text.includes('accounting') || text.includes('財務')) {
        matchedTags.push('accounting');
    }
    if (text.includes('人事') || text.includes('総務') || text.includes('hr') || text.includes('admin') || text.includes('管理部門')) {
        matchedTags.push('hr-admin');
    }

    return [...new Set(matchedTags)]; // Remove duplicates
}

async function main() {
    console.log('=== Tag Application Script ===\n');

    // Step 1: Fetch existing tags
    console.log('Step 1: Fetching existing tags...');
    const existingTags = await fetchExistingTags();
    console.log(`Found ${existingTags.length} existing tags`);

    // Create a map of existing tags by slug
    const tagMap = {};
    existingTags.forEach(tag => {
        tagMap[tag.slug] = tag.id;
    });

    // Step 2: Create missing standard tags
    console.log('\nStep 2: Creating missing standard tags...');
    for (const tag of standardTags) {
        if (!tagMap[tag.slug]) {
            try {
                const created = await createTag(tag.name, tag.slug);
                tagMap[tag.slug] = created.id;
                console.log(`  Created tag: ${tag.name} (ID: ${created.id})`);
            } catch (err) {
                if (err.status === 400) {
                    // Tag might exist with different slug, try to find it
                    console.log(`  Tag "${tag.name}" may already exist`);
                } else {
                    console.log(`  Error creating tag "${tag.name}":`, err.status);
                }
            }
        } else {
            console.log(`  Tag exists: ${tag.name} (ID: ${tagMap[tag.slug]})`);
        }
    }

    // Step 3: Load posts from backup
    console.log('\nStep 3: Loading posts from backup...');
    const posts = JSON.parse(fs.readFileSync('backup_2026-01-25/all_posts_backup.json', 'utf8'));
    console.log(`Loaded ${posts.length} posts`);

    // Step 4: Analyze and update each post
    console.log('\nStep 4: Analyzing and updating posts...');

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    const results = [];

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const matchedSlugs = analyzePost(post);

        // Convert slugs to tag IDs
        const newTagIds = matchedSlugs.map(slug => tagMap[slug]).filter(id => id);

        // Merge with existing tags (don't remove existing ones)
        const existingTagIds = post.tags || [];
        const allTagIds = [...new Set([...existingTagIds, ...newTagIds])];

        const title = post.title.rendered || post.title.raw || 'Untitled';

        if (newTagIds.length === 0) {
            console.log(`[${i+1}/${posts.length}] Skipping: ${title.substring(0, 40)}... (no matching tags)`);
            skipped++;
            results.push({ id: post.id, title, status: 'skipped', newTags: [] });
            continue;
        }

        // Check if we need to update (new tags to add)
        const tagsToAdd = newTagIds.filter(id => !existingTagIds.includes(id));
        if (tagsToAdd.length === 0) {
            console.log(`[${i+1}/${posts.length}] No change: ${title.substring(0, 40)}... (tags already set)`);
            skipped++;
            results.push({ id: post.id, title, status: 'no_change', existingTags: existingTagIds });
            continue;
        }

        try {
            await updatePostTags(post.id, allTagIds);
            console.log(`[${i+1}/${posts.length}] Updated: ${title.substring(0, 40)}... (+${tagsToAdd.length} tags: ${matchedSlugs.join(', ')})`);
            updated++;
            results.push({ id: post.id, title, status: 'updated', addedTags: matchedSlugs, totalTags: allTagIds.length });

            // Rate limiting - wait a bit between updates
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (err) {
            console.log(`[${i+1}/${posts.length}] Error: ${title.substring(0, 40)}... - ${err.status || err.message}`);
            errors++;
            results.push({ id: post.id, title, status: 'error', error: err.status || err.message });
        }
    }

    // Save results
    fs.writeFileSync('tag_update_results.json', JSON.stringify(results, null, 2));

    console.log('\n=== Summary ===');
    console.log(`Total posts: ${posts.length}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors}`);
    console.log('\nResults saved to tag_update_results.json');
}

main().catch(console.error);
