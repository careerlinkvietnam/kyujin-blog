const https = require('https');
const fs = require('fs');

const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// CTA Templates
const CTA_LIGHT = `
<div class="cta-box cta-light" style="background: #f8f9fa; border-left: 4px solid #0066cc; padding: 20px; margin: 30px 0;">
<h3 style="margin-top: 0; color: #0066cc;">タイ・ベトナムでの採用についてご相談いただけます</h3>
<p>CareerLink Asiaでは、東南アジアでの人材採用に関するご相談を承っております。</p>
<ul>
<li>現地の採用市場・給与相場について知りたい</li>
<li>採用プロセスや必要書類を確認したい</li>
<li>まずは情報収集から始めたい</li>
</ul>
<p><a href="https://kyujin.careerlink.asia/お問い合わせ" style="display: inline-block; background: #0066cc; color: #fff; padding: 10px 24px; text-decoration: none; border-radius: 4px;">お問い合わせはこちら</a></p>
<p style="font-size: 0.9em; color: #666; margin-bottom: 0;">※ご相談は無料です。お気軽にお問い合わせください。</p>
</div>`;

const CTA_STANDARD = `
<div class="cta-box cta-standard" style="background: #e8f4f8; border: 2px solid #0066cc; padding: 24px; margin: 30px 0; border-radius: 8px;">
<h3 style="margin-top: 0; color: #004d99;">【企業の人事・採用担当者様へ】タイ・ベトナムの人材採用をサポートします</h3>
<p>CareerLink Asiaは、タイ・ベトナムを中心とした東南アジアの日系企業向け人材紹介サービスを提供しています。</p>
<ul>
<li>現地採用の求人票作成・掲載</li>
<li>候補者のスクリーニング・面接調整</li>
<li>給与相場・労務に関するアドバイス</li>
<li>入社後のビザ・労働許可証取得サポート</li>
</ul>
<p><strong>まずはお気軽にご相談ください。</strong></p>
<p><a href="https://kyujin.careerlink.asia/お問い合わせ" style="display: inline-block; background: #004d99; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-weight: bold;">採用のご相談・お問い合わせ</a></p>
<p style="font-size: 0.9em; color: #666; margin-bottom: 0;">※初回ご相談無料。通常1〜2営業日以内にご返信いたします。</p>
</div>`;

const CTA_STRONG = `
<div class="cta-box cta-strong" style="background: linear-gradient(135deg, #004d99 0%, #0066cc 100%); color: #fff; padding: 28px; margin: 30px 0; border-radius: 8px;">
<h3 style="margin-top: 0; color: #fff;">タイ・ベトナムでの人材採用、今すぐご相談ください</h3>
<p>CareerLink Asiaは、東南アジア専門の人材紹介会社として15年以上の実績があります。</p>
<ul style="color: #fff;">
<li>✓ タイ・ベトナム現地法人での即戦力採用</li>
<li>✓ 日本語人材・バイリンガル人材の紹介</li>
<li>✓ 採用から入社後フォローまで一貫サポート</li>
<li>✓ 現地の労務・給与相場に精通したコンサルタント</li>
</ul>
<p style="font-size: 1.1em;"><strong>採用課題をお聞かせください。最適な人材をご紹介します。</strong></p>
<p><a href="https://kyujin.careerlink.asia/お問い合わせ" style="display: inline-block; background: #fff; color: #004d99; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1em;">無料相談を申し込む</a></p>
<p style="font-size: 0.85em; opacity: 0.9; margin-bottom: 0;">※秘密厳守。採用が決定するまで費用は発生しません。</p>
</div>`;

// Article configurations
const ARTICLE_CONFIG = {
    6992: {
        type: '問い合わせ直前',
        country: 'TH',
        ctaMid: 'Standard',
        ctaEnd: 'Strong',
        sources: ['タイ労働省', 'JETRO', 'タイ日本人商工会議所'],
        links: [
            { url: 'thailand-labor-law-employer-guide-2025', text: 'タイ労働法の詳細ガイド' },
            { url: 'thailand-minimum-wage-guide-2025', text: 'タイの最低賃金情報' },
            { url: 'thailand-visa-work-permit-guide-2026', text: 'タイの就労ビザ・ワークパーミット' }
        ]
    },
    6804: {
        type: '問い合わせ直前',
        country: 'VN',
        ctaMid: 'Standard',
        ctaEnd: 'Strong',
        sources: ['ベトナム労働・傷病兵・社会省', 'JETRO', 'ベトナム日本商工会議所'],
        links: [
            { url: 'vietnam-labor-law-employer-guide-2026', text: 'ベトナム労働法の詳細ガイド' },
            { url: 'vietnam-minimum-wage-2026', text: 'ベトナムの最低賃金情報' },
            { url: 'vietnam-work-visa-application-guide-2026', text: 'ベトナムの就労ビザ申請' }
        ]
    },
    8008: {
        type: '信頼構築',
        country: 'TH',
        ctaMid: 'Light',
        ctaEnd: 'Standard',
        sources: ['タイ労働保護法（B.E.2541）', 'タイ労働省公式サイト', '在タイ日本国大使館'],
        links: [
            { url: 'thailand-dismissal-regulations-guide-2026', text: 'タイの解雇規定' },
            { url: 'thailand-severance-pay-guide-2026', text: 'タイの退職金制度' },
            { url: 'thailand-social-security-guide-2026', text: 'タイの社会保険制度' }
        ]
    },
    7998: {
        type: '信頼構築',
        country: 'VN',
        ctaMid: 'Light',
        ctaEnd: 'Standard',
        sources: ['ベトナム労働法（2019年改正）', 'ベトナム労働・傷病兵・社会省', '在ベトナム日本国大使館'],
        links: [
            { url: 'vietnam-dismissal-regulations-guide-2026', text: 'ベトナムの解雇規定' },
            { url: 'vietnam-severance-pay-guide-2026', text: 'ベトナムの退職金制度' },
            { url: 'vietnam-social-security-guide-2026', text: 'ベトナムの社会保険制度' }
        ]
    },
    8128: {
        type: '信頼構築',
        country: 'TH',
        ctaMid: 'Light',
        ctaEnd: 'Standard',
        sources: ['タイ労働保護法', 'タイ労働裁判所判例', 'JETRO'],
        links: [
            { url: 'thailand-labor-law-employer-guide-2025', text: 'タイ労働法の詳細' },
            { url: 'thailand-severance-pay-guide-2026', text: 'タイの退職金制度' },
            { url: 'thailand-social-security-guide-2026', text: 'タイの社会保険' }
        ]
    },
    8135: {
        type: '信頼構築',
        country: 'VN',
        ctaMid: 'Light',
        ctaEnd: 'Standard',
        sources: ['ベトナム労働法', 'ベトナム労働・傷病兵・社会省', 'JETRO'],
        links: [
            { url: 'vietnam-labor-law-employer-guide-2026', text: 'ベトナム労働法の詳細' },
            { url: 'vietnam-severance-pay-guide-2026', text: 'ベトナムの退職金制度' },
            { url: 'vietnam-social-security-guide-2026', text: 'ベトナムの社会保険' }
        ]
    },
    7997: {
        type: '専門性証明',
        country: 'TH',
        ctaMid: 'Standard',
        ctaEnd: 'Standard',
        sources: ['タイ国家賃金委員会', 'タイ労働省', 'タイ中央銀行'],
        links: [
            { url: 'thailand-labor-law-employer-guide-2025', text: 'タイ労働法ガイド' },
            { url: 'thailand-personal-income-tax-guide-2026', text: 'タイの個人所得税' },
            { url: 'thailand-social-security-guide-2026', text: 'タイの社会保険制度' }
        ]
    },
    7995: {
        type: '専門性証明',
        country: 'VN',
        ctaMid: 'Standard',
        ctaEnd: 'Standard',
        sources: ['ベトナム政府政令', 'ベトナム労働・傷病兵・社会省', 'ベトナム中央銀行'],
        links: [
            { url: 'vietnam-labor-law-employer-guide-2026', text: 'ベトナム労働法ガイド' },
            { url: 'vietnam-personal-income-tax-guide-2026', text: 'ベトナムの個人所得税' },
            { url: 'vietnam-social-security-guide-2026', text: 'ベトナムの社会保険制度' }
        ]
    },
    8129: {
        type: '信頼構築',
        country: 'TH',
        ctaMid: 'Light',
        ctaEnd: 'Standard',
        sources: ['タイ労働保護法', 'タイ労働省', '在タイ日本国大使館'],
        links: [
            { url: 'thailand-labor-law-employer-guide-2025', text: 'タイ労働法の詳細' },
            { url: 'thailand-dismissal-regulations-guide-2026', text: 'タイの解雇規定' },
            { url: 'thailand-social-security-guide-2026', text: 'タイの社会保険' }
        ]
    },
    8136: {
        type: '信頼構築',
        country: 'VN',
        ctaMid: 'Light',
        ctaEnd: 'Standard',
        sources: ['ベトナム労働法', 'ベトナム労働・傷病兵・社会省', '在ベトナム日本国大使館'],
        links: [
            { url: 'vietnam-labor-law-employer-guide-2026', text: 'ベトナム労働法の詳細' },
            { url: 'vietnam-dismissal-regulations-guide-2026', text: 'ベトナムの解雇規定' },
            { url: 'vietnam-social-security-guide-2026', text: 'ベトナムの社会保険' }
        ]
    },
    8130: {
        type: '信頼構築',
        country: 'TH',
        ctaMid: 'Light',
        ctaEnd: 'Standard',
        sources: ['タイ社会保険法', 'タイ社会保険事務所', 'JETRO'],
        links: [
            { url: 'thailand-labor-law-employer-guide-2025', text: 'タイ労働法の詳細' },
            { url: 'thailand-minimum-wage-guide-2025', text: 'タイの最低賃金' },
            { url: 'thailand-personal-income-tax-guide-2026', text: 'タイの個人所得税' }
        ]
    },
    8137: {
        type: '信頼構築',
        country: 'VN',
        ctaMid: 'Light',
        ctaEnd: 'Standard',
        sources: ['ベトナム社会保険法', 'ベトナム社会保険機関', 'JETRO'],
        links: [
            { url: 'vietnam-labor-law-employer-guide-2026', text: 'ベトナム労働法の詳細' },
            { url: 'vietnam-minimum-wage-2026', text: 'ベトナムの最低賃金' },
            { url: 'vietnam-personal-income-tax-guide-2026', text: 'ベトナムの個人所得税' }
        ]
    },
    8533: {
        type: '専門性証明',
        country: 'TH',
        ctaMid: 'Standard',
        ctaEnd: 'Standard',
        sources: ['タイ日本人商工会議所', 'JETRO', '在タイ日本国大使館'],
        links: [
            { url: 'thailand-labor-law-employer-guide-2025', text: 'タイ労働法ガイド' },
            { url: 'thailand-japanese-company-ranking-2026', text: 'タイ日系企業ランキング' },
            { url: 'タイ人材紹介会社', text: 'タイの人材紹介会社一覧' }
        ]
    },
    8534: {
        type: '専門性証明',
        country: 'VN',
        ctaMid: 'Standard',
        ctaEnd: 'Standard',
        sources: ['ベトナム日本商工会議所', 'JETRO', '在ベトナム日本国大使館'],
        links: [
            { url: 'vietnam-labor-law-employer-guide-2026', text: 'ベトナム労働法ガイド' },
            { url: 'vietnam-japanese-company-ranking-2026', text: 'ベトナム日系企業ランキング' },
            { url: 'ベトナム人材紹介会社', text: 'ベトナムの人材紹介会社一覧' }
        ]
    },
    8033: {
        type: '専門性証明',
        country: 'TH',
        ctaMid: 'Standard',
        ctaEnd: 'Standard',
        sources: ['タイ自動車産業協会', 'タイ投資委員会（BOI）', 'JETRO'],
        links: [
            { url: 'thailand-boi-investment-incentives-2026', text: 'タイBOI投資恩典ガイド' },
            { url: 'thailand-manufacturing-job-guide-2026', text: 'タイ製造業求人ガイド' },
            { url: 'タイ人材紹介会社', text: 'タイの人材紹介会社一覧' }
        ]
    },
    8003: {
        type: '専門性証明',
        country: 'VN',
        ctaMid: 'Standard',
        ctaEnd: 'Standard',
        sources: ['ベトナム計画投資省', 'JETRO', 'ベトナム日本商工会議所'],
        links: [
            { url: 'vietnam-investment-incentives-2026', text: 'ベトナム投資優遇制度' },
            { url: 'vietnam-manufacturing-job-guide-2026', text: 'ベトナム製造業求人ガイド' },
            { url: 'ベトナム人材紹介会社', text: 'ベトナムの人材紹介会社一覧' }
        ]
    },
    8117: {
        type: '専門性証明',
        country: 'TH',
        ctaMid: 'Standard',
        ctaEnd: 'Standard',
        sources: ['タイ歳入局', 'タイ財務省', '在タイ日本国大使館'],
        links: [
            { url: 'thailand-minimum-wage-guide-2025', text: 'タイの最低賃金ガイド' },
            { url: 'thailand-social-security-guide-2026', text: 'タイの社会保険制度' },
            { url: 'thailand-labor-law-employer-guide-2025', text: 'タイ労働法ガイド' }
        ]
    },
    8118: {
        type: '専門性証明',
        country: 'VN',
        ctaMid: 'Standard',
        ctaEnd: 'Standard',
        sources: ['ベトナム税務総局', 'ベトナム財務省', '在ベトナム日本国大使館'],
        links: [
            { url: 'vietnam-minimum-wage-2026', text: 'ベトナムの最低賃金ガイド' },
            { url: 'vietnam-social-security-guide-2026', text: 'ベトナムの社会保険制度' },
            { url: 'vietnam-labor-law-employer-guide-2026', text: 'ベトナム労働法ガイド' }
        ]
    },
    8005: {
        type: '専門性証明',
        country: 'TH',
        ctaMid: 'Standard',
        ctaEnd: 'Standard',
        sources: ['タイ労働省', 'タイ入国管理局', '在タイ日本国大使館'],
        links: [
            { url: 'thailand-labor-law-employer-guide-2025', text: 'タイ労働法ガイド' },
            { url: 'thailand-foreign-employment-regulations-2025', text: 'タイ外国人雇用規制' },
            { url: 'タイ人材紹介会社', text: 'タイの人材紹介会社一覧' }
        ]
    },
    8024: {
        type: '専門性証明',
        country: 'VN',
        ctaMid: 'Standard',
        ctaEnd: 'Standard',
        sources: ['ベトナム労働・傷病兵・社会省', 'ベトナム入国管理局', '在ベトナム日本国大使館'],
        links: [
            { url: 'vietnam-labor-law-employer-guide-2026', text: 'ベトナム労働法ガイド' },
            { url: 'vietnam-work-visa-application-guide-2026', text: 'ベトナム就労ビザ申請' },
            { url: 'ベトナム人材紹介会社', text: 'ベトナムの人材紹介会社一覧' }
        ]
    }
};

function getCTA(strength) {
    switch(strength) {
        case 'Light': return CTA_LIGHT;
        case 'Standard': return CTA_STANDARD;
        case 'Strong': return CTA_STRONG;
        default: return CTA_STANDARD;
    }
}

function createTrustBlock(config) {
    const today = new Date().toISOString().split('T')[0];
    return `
<div class="article-meta" style="background: #f5f5f5; padding: 16px; margin: 30px 0; border-radius: 4px; font-size: 0.9em;">
<p style="margin: 0 0 8px 0;"><strong>最終確認日</strong>: ${today}</p>
<p style="margin: 0 0 8px 0;"><strong>参照情報</strong>:</p>
<ul style="margin: 0 0 8px 0; padding-left: 20px;">
${config.sources.map(s => `<li>${s}</li>`).join('\n')}
</ul>
<p style="margin: 0;"><strong>更新履歴</strong>: 2026年1月 - B2B CTA追加、内部リンク再設計、信頼補強ブロック追加。</p>
</div>`;
}

function createInternalLinks(config) {
    const baseUrl = 'https://kyujin.careerlink.asia/blog/';
    return `
<h3>関連記事</h3>
<ul>
${config.links.map(l => `<li><a href="${baseUrl}${l.url}">${l.text}</a></li>`).join('\n')}
</ul>`;
}

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
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

function updateArticle(id, content) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ content });
        const options = {
            hostname: 'kyujin.careerlink.asia',
            path: `/blog/wp-json/wp/v2/posts/${id}`,
            method: 'POST',
            headers: {
                'Authorization': AUTH,
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.id ? { success: true, id: json.id } : { success: false, error: data });
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function processArticle(id) {
    const config = ARTICLE_CONFIG[id];
    if (!config) return { id, success: false, error: 'No config' };

    try {
        const article = await fetchArticle(id);
        let content = article.content?.rendered || '';

        // Remove existing CTA boxes if present (to avoid duplication)
        content = content.replace(/<div class="cta-box[^>]*>[\s\S]*?<\/div>\s*(<\/div>)?/gi, '');

        // Remove existing trust blocks if present
        content = content.replace(/<div class="article-meta[^>]*>[\s\S]*?<\/div>/gi, '');

        // Find insertion point for mid-article CTA (after ~2500 chars)
        let midInsertPos = 0;
        let charCount = 0;
        const paragraphs = content.split(/<\/p>/i);
        let rebuiltContent = '';
        let midCTAInserted = false;

        for (let i = 0; i < paragraphs.length; i++) {
            rebuiltContent += paragraphs[i];
            if (i < paragraphs.length - 1) {
                rebuiltContent += '</p>';
            }
            charCount += paragraphs[i].length;

            // Insert mid CTA after ~2500 characters
            if (!midCTAInserted && charCount > 2500) {
                rebuiltContent += getCTA(config.ctaMid);
                midCTAInserted = true;
            }
        }

        content = rebuiltContent;

        // Add internal links section before end
        const existingRelated = content.match(/<h[23]>関連記事<\/h[23]>[\s\S]*?<\/ul>/i);
        if (!existingRelated) {
            content += createInternalLinks(config);
        }

        // Add trust block
        content += createTrustBlock(config);

        // Add end CTA
        content += getCTA(config.ctaEnd);

        // Update the article
        const result = await updateArticle(id, content);

        return {
            id,
            success: result.success,
            type: config.type,
            ctaMid: config.ctaMid,
            ctaEnd: config.ctaEnd,
            linksAdded: config.links.length
        };

    } catch (e) {
        return { id, success: false, error: e.message };
    }
}

async function main() {
    console.log('Starting Phase 2 updates...\n');

    const results = [];
    const ids = Object.keys(ARTICLE_CONFIG).map(Number);

    for (const id of ids) {
        const result = await processArticle(id);
        results.push(result);

        if (result.success) {
            console.log(`Updated: ID ${id} (${result.type})`);
        } else {
            console.log(`Failed: ID ${id} - ${result.error}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 500));
    }

    // Save results
    fs.writeFileSync('update_results.json', JSON.stringify(results, null, 2), 'utf8');

    console.log('\n=== Update Summary ===\n');
    console.log('| ID | Success | Type | Mid CTA | End CTA | Links |');
    console.log('|----|---------|------|---------|---------|-------|');

    for (const r of results) {
        if (r.success) {
            console.log(`| ${r.id} | ✅ | ${r.type} | ${r.ctaMid} | ${r.ctaEnd} | ${r.linksAdded} |`);
        } else {
            console.log(`| ${r.id} | ❌ | - | - | - | - |`);
        }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`\nTotal: ${successCount}/${results.length} articles updated successfully.`);
}

main();
