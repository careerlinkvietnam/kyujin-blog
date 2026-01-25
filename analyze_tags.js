const https = require('https');
const fs = require('fs');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

async function fetchTags() {
    return new Promise((resolve) => {
        const options = {
            hostname: 'kyujin.careerlink.asia',
            port: 443,
            path: '/blog/wp-json/wp/v2/tags?per_page=100',
            method: 'GET',
            headers: { 'Authorization': `Basic ${auth}` }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    resolve([]);
                }
            });
        });
        req.end();
    });
}

async function fetchCategories() {
    return new Promise((resolve) => {
        const options = {
            hostname: 'kyujin.careerlink.asia',
            port: 443,
            path: '/blog/wp-json/wp/v2/categories?per_page=100',
            method: 'GET',
            headers: { 'Authorization': `Basic ${auth}` }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    resolve([]);
                }
            });
        });
        req.end();
    });
}

async function main() {
    // Load backup
    const posts = JSON.parse(fs.readFileSync('backup_2026-01-25/all_posts_backup.json', 'utf8'));

    console.log('=== CURRENT TAGS ===');
    const tags = await fetchTags();
    console.log(`Total tags: ${tags.length}`);
    tags.forEach(t => console.log(`  - ${t.name} (ID: ${t.id}, count: ${t.count})`));

    console.log('\n=== CURRENT CATEGORIES ===');
    const categories = await fetchCategories();
    console.log(`Total categories: ${categories.length}`);
    categories.forEach(c => console.log(`  - ${c.name} (ID: ${c.id}, count: ${c.count})`));

    console.log('\n=== ARTICLE ANALYSIS ===');

    // Analyze articles by keywords
    const analysis = {
        thailand: [],
        vietnam: [],
        indonesia: [],
        sea: [], // Southeast Asia general
        jobseeker: [],
        employer: [], // B2B/HR
        salary: [],
        visa: [],
        tax: [],
        labor_law: [],
        living: [],
        manufacturing: [],
        it: [],
        sales: [],
        accounting: [],
        hr_admin: []
    };

    posts.forEach(post => {
        const title = (post.title.rendered || post.title.raw || '').toLowerCase();
        const content = (post.content.raw || post.content.rendered || '').toLowerCase();
        const text = title + ' ' + content;

        if (text.includes('タイ') || text.includes('thailand') || text.includes('バンコク') || text.includes('bangkok')) {
            analysis.thailand.push(post.id);
        }
        if (text.includes('ベトナム') || text.includes('vietnam') || text.includes('ホーチミン') || text.includes('ハノイ')) {
            analysis.vietnam.push(post.id);
        }
        if (text.includes('インドネシア') || text.includes('indonesia') || text.includes('ジャカルタ')) {
            analysis.indonesia.push(post.id);
        }
        if (text.includes('東南アジア') || text.includes('southeast asia') || text.includes('asean')) {
            analysis.sea.push(post.id);
        }
        if (text.includes('転職') || text.includes('求職') || text.includes('働きたい方')) {
            analysis.jobseeker.push(post.id);
        }
        if (text.includes('人事') || text.includes('採用担当') || text.includes('経営者') || text.includes('企業向け')) {
            analysis.employer.push(post.id);
        }
        if (text.includes('給与') || text.includes('年収') || text.includes('給料') || text.includes('salary')) {
            analysis.salary.push(post.id);
        }
        if (text.includes('ビザ') || text.includes('visa') || text.includes('労働許可') || text.includes('work permit')) {
            analysis.visa.push(post.id);
        }
        if (text.includes('税金') || text.includes('所得税') || text.includes('tax')) {
            analysis.tax.push(post.id);
        }
        if (text.includes('労働法') || text.includes('労働保護') || text.includes('labor law')) {
            analysis.labor_law.push(post.id);
        }
        if (text.includes('生活費') || text.includes('生活') || text.includes('住居') || text.includes('living')) {
            analysis.living.push(post.id);
        }
        if (text.includes('製造') || text.includes('工場') || text.includes('manufacturing')) {
            analysis.manufacturing.push(post.id);
        }
        if (text.includes('it') || text.includes('エンジニア') || text.includes('プログラマ') || text.includes('se')) {
            analysis.it.push(post.id);
        }
        if (text.includes('営業') || text.includes('sales')) {
            analysis.sales.push(post.id);
        }
        if (text.includes('経理') || text.includes('会計') || text.includes('accounting')) {
            analysis.accounting.push(post.id);
        }
        if (text.includes('人事') || text.includes('総務') || text.includes('hr') || text.includes('admin')) {
            analysis.hr_admin.push(post.id);
        }
    });

    console.log('\nKeyword Analysis Results:');
    Object.entries(analysis).forEach(([key, ids]) => {
        console.log(`  ${key}: ${ids.length} articles`);
    });

    // Check how many posts have tags
    const postsWithTags = posts.filter(p => p.tags && p.tags.length > 0);
    const postsWithoutTags = posts.filter(p => !p.tags || p.tags.length === 0);

    console.log(`\n=== TAG STATUS ===`);
    console.log(`Posts with tags: ${postsWithTags.length}`);
    console.log(`Posts without tags: ${postsWithoutTags.length}`);

    // Save analysis for later use
    fs.writeFileSync('tag_analysis.json', JSON.stringify({
        existingTags: tags,
        existingCategories: categories,
        analysis: analysis,
        postsWithoutTags: postsWithoutTags.map(p => ({ id: p.id, title: p.title.rendered }))
    }, null, 2));

    console.log('\nAnalysis saved to tag_analysis.json');
}

main();
