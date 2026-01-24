const https = require('https');
const fs = require('fs');

// Backlog A article IDs
const ARTICLE_IDS = [
    6992, 6804, 8008, 7998, 8128, 8135, 7997, 7995, 8129, 8136,
    8130, 8137, 8533, 8534, 8033, 8003, 8117, 8118, 8005, 8024
];

const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

function fetchArticle(id) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'kyujin.careerlink.asia',
            path: `/blog/wp-json/wp/v2/posts/${id}`,
            method: 'GET',
            headers: { 'Authorization': AUTH }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({
                        id: json.id,
                        title: json.title?.rendered || '',
                        slug: json.slug || '',
                        content: json.content?.rendered || '',
                        link: json.link || ''
                    });
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function analyzeArticle(article) {
    const content = article.content;

    // Check for existing CTAs
    const hasB2BCTA = content.includes('お問い合わせ') || content.includes('採用担当');
    const hasJobseekerCTA = content.includes('jobseeker/register') || content.includes('会員登録');

    // Check internal links
    const internalLinks = (content.match(/href="https:\/\/kyujin\.careerlink\.asia\/blog\/[^"]+"/g) || []).length;
    const hasHubLink = content.includes('thailand-job-complete-guide') ||
                       content.includes('vietnam-job-complete-guide') ||
                       content.includes('overseas-recruitment-agent');

    // Check for trust elements
    const hasLastReviewed = content.includes('最終確認日') || content.includes('Last reviewed');
    const hasSources = content.includes('参照情報') || content.includes('Sources');

    // Determine article type based on title/content
    let articleType = 'unknown';
    let ctaStrength = 'Standard';

    const title = article.title.toLowerCase();
    if (title.includes('人材紹介') || title.includes('エージェント')) {
        articleType = '問い合わせ直前';
        ctaStrength = 'Strong';
    } else if (title.includes('労働法') || title.includes('解雇') || title.includes('退職金') || title.includes('社会保険')) {
        articleType = '信頼構築';
        ctaStrength = 'Standard';
    } else if (title.includes('最低賃金') || title.includes('所得税') || title.includes('ビザ') || title.includes('雇用規制')) {
        articleType = '専門性証明';
        ctaStrength = 'Standard';
    } else if (title.includes('働く') || title.includes('日系企業動向')) {
        articleType = '専門性証明';
        ctaStrength = 'Standard';
    }

    // Determine country
    let country = '共通';
    if (title.includes('タイ') || title.includes('thailand') || title.includes('thai')) {
        country = 'TH';
    } else if (title.includes('ベトナム') || title.includes('vietnam') || title.includes('viet')) {
        country = 'VN';
    }

    return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        country,
        articleType,
        ctaStrength,
        hasB2BCTA,
        hasJobseekerCTA,
        internalLinks,
        hasHubLink,
        hasLastReviewed,
        hasSources,
        contentLength: content.length
    };
}

async function main() {
    console.log('Fetching and analyzing Backlog A articles...\n');

    const results = [];

    for (const id of ARTICLE_IDS) {
        try {
            const article = await fetchArticle(id);
            const analysis = await analyzeArticle(article);
            results.push(analysis);
            console.log(`Analyzed: ID ${id} - ${analysis.articleType}`);
        } catch (e) {
            console.log(`Error fetching ID ${id}: ${e.message}`);
        }
    }

    // Save analysis results
    fs.writeFileSync(
        'backlog_analysis.json',
        JSON.stringify(results, null, 2),
        'utf8'
    );

    console.log('\n=== Analysis Summary ===\n');
    console.log('| ID | Country | Type | B2B CTA | Links | Trust |');
    console.log('|----|---------|------|---------|-------|-------|');

    for (const r of results) {
        console.log(`| ${r.id} | ${r.country} | ${r.articleType} | ${r.hasB2BCTA ? 'Yes' : 'No'} | ${r.internalLinks} | ${r.hasLastReviewed ? 'Yes' : 'No'} |`);
    }

    console.log('\nAnalysis saved to backlog_analysis.json');
}

main();
