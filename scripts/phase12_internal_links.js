/**
 * Phase 12: 既存記事 → b2b-recruitment-consulting LP 内部リンク設計
 *
 * 実行方法: node scripts/phase12_internal_links.js
 */

const https = require('https');

const API_BASE = 'kyujin.careerlink.asia';
const AUTH = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');
const LP_URL = 'https://kyujin.careerlink.asia/blog/b2b-recruitment-consulting/';

// Type A: 必ずリンク（企業人事が判断で止まる記事）
const TYPE_A = [
    { id: 8563, title: 'タイ人材採用ガイド【企業向け完全版】', linkText: 'パターンA' },
    { id: 8564, title: 'ベトナム人材採用ガイド【企業向け完全版】', linkText: 'パターンA' },
    { id: 8008, title: 'タイ労働法ガイド｜人事・採用担当者向け', linkText: 'パターンB' },
    { id: 7998, title: 'ベトナム労働法・雇用規制ガイド', linkText: 'パターンB' },
    { id: 7997, title: 'タイ最低賃金完全ガイド', linkText: 'パターンB' },
    { id: 7995, title: 'ベトナム最低賃金改定ガイド', linkText: 'パターンB' },
    { id: 8236, title: 'タイ労働者保護法', linkText: 'パターンB' },
    { id: 8263, title: 'ベトナム労働契約の重要ポイント', linkText: 'パターンB' },
    { id: 8128, title: 'タイ解雇規定完全ガイド', linkText: 'パターンB' },
    { id: 8135, title: 'ベトナム解雇規定完全ガイド', linkText: 'パターンB' },
    { id: 8129, title: 'タイ退職金制度完全ガイド', linkText: 'パターンB' },
    { id: 8136, title: 'ベトナム退職金制度完全ガイド', linkText: 'パターンB' },
    { id: 3712, title: '日本でベトナム人を採用するには', linkText: 'パターンC' },
];

// Type B: 条件付きリンク（制度・市場解説系）
const TYPE_B = [
    { id: 8538, title: 'ベトナムの祝日・年中行事ビジネスガイド' },
    { id: 8537, title: 'タイの祝日・年中行事ビジネスガイド' },
    { id: 8536, title: 'ベトナム赴任・駐在準備完全ガイド' },
    { id: 8535, title: 'タイ赴任・駐在準備完全ガイド' },
    { id: 8534, title: 'ベトナム人と働く完全ガイド' },
    { id: 8533, title: 'タイ人と働く完全ガイド' },
    { id: 8329, title: 'ベトナムで外国人が働く際の法的注意点' },
    { id: 8322, title: 'タイで外国人が働く際の法的注意点' },
    { id: 8327, title: 'ベトナム日系企業の福利厚生比較' },
    { id: 8318, title: 'タイ日系企業の福利厚生比較' },
    { id: 8130, title: 'タイ社会保険制度完全ガイド' },
    { id: 8137, title: 'ベトナム社会保険制度完全ガイド' },
    { id: 8033, title: 'タイ日系企業動向・自動車産業' },
    { id: 8003, title: 'ベトナム日系企業動向' },
    { id: 8034, title: 'タイBOI投資恩典完全ガイド' },
    { id: 8138, title: 'ベトナム投資優遇制度' },
    { id: 8009, title: 'タイEEC投資ガイド' },
    { id: 8126, title: 'ベトナム人事・総務職求人' },
    { id: 8125, title: 'ベトナム経理・会計職求人' },
    { id: 8124, title: 'ベトナム営業職求人' },
    { id: 8123, title: 'ベトナムIT求人' },
    { id: 8122, title: 'タイ人事・総務職求人' },
    { id: 8121, title: 'タイ経理・会計職求人' },
    { id: 8120, title: 'タイ営業職求人' },
    { id: 8131, title: 'タイ経済2026年見通し' },
    { id: 8036, title: 'ベトナム経済動向・成長予測' },
];

// リンクテキストパターン
const LINK_PATTERNS = {
    // パターンA: 採用ガイド系の末尾用
    patternA: `
<h3>採用条件の妥当性を確認したい場合</h3>
<p>本記事で採用の流れや制度を把握した上で、「この条件で本当に採用できるのか」「給与設定が市場に合っているか」といった判断に迷う場合は、<a href="${LP_URL}">採用難易度・給与レンジを事実ベースで整理する無料相談</a>をご活用ください。</p>
`,
    // パターンB: 労働法・制度系の末尾用
    patternB: `
<h3>採用・雇用の判断でお困りの場合</h3>
<p>制度や規定を理解した上で、「自社の条件で採用が現実的か」「どのような人材紹介会社に依頼すべきか」といった判断に迷う場合は、<a href="${LP_URL}">採用難易度・給与レンジを事実ベースで整理する無料相談</a>をご活用ください。</p>
`,
    // パターンC: 日本での外国人採用系
    patternC: `
<h3>採用条件の市場適合性を確認したい場合</h3>
<p>採用要件を整理した上で、「この条件で本当に採用できるのか」判断に迷う場合は、<a href="${LP_URL}">採用難易度・給与レンジを事実ベースで整理する無料相談</a>をご活用ください。</p>
`,
    // パターンD: Type B用（市場・制度解説系）
    patternD: `
<p>なお、採用の判断に迷う場合は、<a href="${LP_URL}">採用難易度・給与レンジを事実ベースで整理する無料相談</a>も行っています。</p>
`,
};

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

function updatePost(postId, content) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ content: content });

        const options = {
            hostname: API_BASE,
            port: 443,
            path: '/blog/wp-json/wp/v2/posts/' + postId,
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + AUTH,
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve({ success: true });
                } else {
                    reject(new Error('HTTP ' + res.statusCode + ': ' + responseData.substring(0, 200)));
                }
            });
        });

        req.on('error', reject);
        req.setTimeout(60000, () => { req.destroy(); reject(new Error('Timeout')); });
        req.write(data);
        req.end();
    });
}

async function processArticle(item, type) {
    try {
        // 記事を取得
        const post = await fetch('https://kyujin.careerlink.asia/blog/wp-json/wp/v2/posts/' + item.id);
        let content = post.content.rendered;

        // 既にLPリンクがあるかチェック
        if (content.includes('b2b-recruitment-consulting')) {
            return { id: item.id, title: item.title, status: 'skip', reason: 'Already has LP link' };
        }

        // リンクパターンを選択
        let linkHtml;
        if (type === 'A') {
            if (item.linkText === 'パターンA') {
                linkHtml = LINK_PATTERNS.patternA;
            } else if (item.linkText === 'パターンB') {
                linkHtml = LINK_PATTERNS.patternB;
            } else if (item.linkText === 'パターンC') {
                linkHtml = LINK_PATTERNS.patternC;
            }
        } else {
            linkHtml = LINK_PATTERNS.patternD;
        }

        // 末尾に追加（最後の</p>の後、または最後のセクションの前）
        // まとめセクションがあればその前に、なければ末尾に追加
        const summaryPatterns = [
            /<h2[^>]*>まとめ/i,
            /<h2[^>]*>おわりに/i,
            /<h2[^>]*>最後に/i,
            /<h2[^>]*>終わりに/i,
        ];

        let inserted = false;
        for (const pattern of summaryPatterns) {
            const match = content.match(pattern);
            if (match) {
                const insertPos = match.index;
                content = content.substring(0, insertPos) + linkHtml + '\n' + content.substring(insertPos);
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            // まとめセクションがない場合は末尾に追加
            content = content + linkHtml;
        }

        // 更新
        await updatePost(item.id, content);

        return { id: item.id, title: item.title, status: 'success', type: type };

    } catch (err) {
        return { id: item.id, title: item.title, status: 'error', error: err.message };
    }
}

async function main() {
    console.log('===========================================');
    console.log('Phase 12: 内部リンク再設計');
    console.log('===========================================\n');

    const results = [];

    // Type A を処理
    console.log('--- Type A（必須リンク）処理中 ---\n');
    for (const item of TYPE_A) {
        const result = await processArticle(item, 'A');
        results.push(result);
        const status = result.status === 'success' ? '✓' : (result.status === 'skip' ? '→' : '✗');
        console.log(status + ' ' + result.id + ': ' + result.title.substring(0, 30));
        if (result.reason) console.log('   ' + result.reason);
    }

    console.log('\n--- Type B（条件付きリンク）処理中 ---\n');
    for (const item of TYPE_B) {
        const result = await processArticle(item, 'B');
        results.push(result);
        const status = result.status === 'success' ? '✓' : (result.status === 'skip' ? '→' : '✗');
        console.log(status + ' ' + result.id + ': ' + result.title.substring(0, 30));
        if (result.reason) console.log('   ' + result.reason);
    }

    // 結果サマリー
    const success = results.filter(r => r.status === 'success').length;
    const skip = results.filter(r => r.status === 'skip').length;
    const error = results.filter(r => r.status === 'error').length;

    console.log('\n===========================================');
    console.log('完了');
    console.log('  成功: ' + success);
    console.log('  スキップ（既存リンクあり）: ' + skip);
    console.log('  エラー: ' + error);
    console.log('===========================================');

    // 結果をログファイルに出力
    const fs = require('fs');
    const logContent = `# Phase 12 実行ログ

**実行日時**: ${new Date().toISOString()}

## 結果サマリー
- 成功: ${success}件
- スキップ: ${skip}件
- エラー: ${error}件

## Type A（必須リンク）
${results.filter(r => TYPE_A.find(a => a.id === r.id)).map(r =>
    `| ${r.id} | ${r.title} | ${r.status} |`
).join('\n')}

## Type B（条件付きリンク）
${results.filter(r => TYPE_B.find(b => b.id === r.id)).map(r =>
    `| ${r.id} | ${r.title} | ${r.status} |`
).join('\n')}
`;

    fs.writeFileSync('C:/Users/siank/Desktop/ClaueCode/logs/phase12_log.md', logContent, 'utf8');
    console.log('\nログ: logs/phase12_log.md');
}

main().catch(console.error);
