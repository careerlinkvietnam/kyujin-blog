/**
 * Phase 9: WordPress固定ページ公開スクリプト
 * B2B採用相談LPを固定ページとして作成
 *
 * 実行方法: node scripts/phase9_publish_page.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// WordPress API設定
const API_BASE = 'kyujin.careerlink.asia';
const API_PATH = '/blog/wp-json/wp/v2/pages';
const AUTH = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// 公開対象
const PAGE = {
    title: '海外人材採用に関する無料相談（企業向け）',
    slug: 'b2b-recruitment-consulting',
    draftPath: 'C:/Users/siank/Desktop/ClaueCode/articles/phase8/b2b_recruitment_consulting_lp.md'
};

// 簡易Markdown→HTML変換
function markdownToHtml(md) {
    let html = md;

    // フロントマターを削除（---で囲まれた部分）
    html = html.replace(/^---[\s\S]*?---\n*/m, '');

    // Draft用メタ情報を削除
    html = html.replace(/\*\*ステータス\*\*:.*\n/g, '');
    html = html.replace(/\*\*作成日\*\*:.*\n/g, '');
    html = html.replace(/\*\*ページタイプ\*\*:.*\n/g, '');
    html = html.replace(/\*\*想定読者\*\*:.*\n/g, '');
    html = html.replace(/\*\*公開禁止\*\*:.*\n/g, '');

    // 末尾のDraft情報を削除
    html = html.replace(/---\n+\*\*作成日\*\*:[\s\S]*$/m, '');

    // H1（タイトルとして使用するため削除）
    html = html.replace(/^# .*\n+/m, '');

    // H2
    html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
    // H3
    html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
    // H4
    html = html.replace(/^#### (.*)$/gm, '<h4>$1</h4>');

    // 太字
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // リンク
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // 箇条書き
    html = html.replace(/^- (.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // 水平線
    html = html.replace(/^---$/gm, '<hr>');

    // 段落
    html = html.replace(/\n\n+/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // 空のpタグを削除
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p>(<h[1-4]>)/g, '$1');
    html = html.replace(/(<\/h[1-4]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<hr>)<\/p>/g, '$1');

    return html;
}

// WordPress API: 固定ページ作成
function createPage(title, slug, content) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            title: title,
            slug: slug,
            content: content,
            status: 'publish',
            comment_status: 'closed',
            ping_status: 'closed'
        });

        const options = {
            hostname: API_BASE,
            port: 443,
            path: API_PATH,
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
                if (res.statusCode === 201) {
                    const response = JSON.parse(responseData);
                    resolve({
                        success: true,
                        pageId: response.id,
                        url: response.link,
                        slug: response.slug,
                        modified: response.modified
                    });
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${responseData.substring(0, 500)}`));
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

// ログファイル出力
function writeLog(result) {
    const timestamp = new Date().toISOString();
    const logPath = 'C:/Users/siank/Desktop/ClaueCode/logs/phase9_publish_log.md';

    let log = `# Phase 9 固定ページ公開ログ\n\n`;
    log += `**実行日時**: ${timestamp}\n\n`;
    log += `## 公開結果\n\n`;

    log += `### 固定ページ\n`;
    log += `- **ページID**: ${result.pageId}\n`;
    log += `- **ステータス**: ${result.success ? '成功' : '失敗'}\n`;
    if (result.success) {
        log += `- **URL**: ${result.url}\n`;
        log += `- **スラッグ**: ${result.slug}\n`;
        log += `- **更新日時**: ${result.modified}\n`;
    } else {
        log += `- **エラー**: ${result.error}\n`;
    }
    log += `\n`;

    log += `## 導線接続タスク\n\n`;
    log += `以下の記事のCTAリンクを本固定ページに変更する：\n\n`;
    log += `- [ ] 記事ID: 6992（タイ人材紹介会社一覧）\n`;
    log += `- [ ] 記事ID: 6804（ベトナム人材紹介会社一覧）\n`;
    log += `- [ ] Phase 7 チェックリスト（タイ）\n`;
    log += `- [ ] Phase 7 チェックリスト（ベトナム）\n`;

    // logs ディレクトリがなければ作成
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    fs.writeFileSync(logPath, log, 'utf8');
    return logPath;
}

async function main() {
    console.log('===========================================');
    console.log('Phase 9: WordPress固定ページ公開スクリプト');
    console.log('===========================================\n');

    console.log(`処理中: ${PAGE.title}`);
    console.log(`スラッグ: ${PAGE.slug}`);

    try {
        // Markdownファイル読み込み
        const markdown = fs.readFileSync(PAGE.draftPath, 'utf8');
        console.log(`  ファイル読み込み完了: ${markdown.length} 文字`);

        // HTML変換
        const html = markdownToHtml(markdown);
        console.log(`  HTML変換完了: ${html.length} 文字`);

        // WordPress固定ページ作成
        const result = await createPage(PAGE.title, PAGE.slug, html);
        console.log(`  公開成功: ${result.url}`);
        console.log(`  ページID: ${result.pageId}`);

        // ログ出力
        const logPath = writeLog(result);
        console.log('');
        console.log('===========================================');
        console.log('固定ページ公開完了');
        console.log(`ログファイル: ${logPath}`);
        console.log('===========================================');

    } catch (err) {
        console.log(`  エラー: ${err.message}`);
        writeLog({
            success: false,
            error: err.message
        });
    }
}

main().catch(console.error);
