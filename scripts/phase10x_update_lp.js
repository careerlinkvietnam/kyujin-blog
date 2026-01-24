/**
 * Phase 10.x: B2B LP更新スクリプト
 * - 既存固定ページ（ID: 8569）を更新
 *
 * 実行方法: node scripts/phase10x_update_lp.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// WordPress API設定
const API_BASE = 'kyujin.careerlink.asia';
const API_PAGES = '/blog/wp-json/wp/v2/pages';
const PAGE_ID = 8569;
const AUTH = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// ドラフトファイルパス
const DRAFT_PATH = 'C:/Users/siank/Desktop/ClaueCode/articles/phase8/b2b_recruitment_consulting_lp.md';

// 簡易Markdown→HTML変換
function markdownToHtml(md) {
    let html = md;

    // フロントマターを削除（---で囲まれた部分）
    html = html.replace(/^---[\s\S]*?---\n*/m, '');

    // Draft用メタ情報を削除
    html = html.replace(/\*\*最終更新日\*\*:.*\n/g, '');
    html = html.replace(/\*\*ページタイプ\*\*:.*\n/g, '');
    html = html.replace(/\*\*ステータス\*\*:.*\n/g, '');
    html = html.replace(/\*\*作成日\*\*:.*\n/g, '');

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

    // リンク - CTAボタンスタイル
    html = html.replace(/\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/g,
        '<p style="text-align:center;margin:30px 0;"><a href="$2" style="display:inline-block;background:#007bff;color:#fff;padding:15px 40px;text-decoration:none;border-radius:5px;font-weight:bold;font-size:1.1em;">$1</a></p>');

    // 通常リンク
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // テーブル変換
    html = html.replace(/\|(.+)\|\n\|[-|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, body) => {
        const headers = header.split('|').filter(h => h.trim());
        const rows = body.trim().split('\n').map(row =>
            row.split('|').filter(c => c.trim())
        );

        let table = '<table style="border-collapse:collapse;width:100%;margin:20px 0;">';
        table += '<thead><tr>';
        headers.forEach(h => {
            table += `<th style="border:1px solid #ddd;padding:12px;background:#f5f5f5;text-align:left;">${h.trim()}</th>`;
        });
        table += '</tr></thead><tbody>';
        rows.forEach(row => {
            table += '<tr>';
            row.forEach(cell => {
                table += `<td style="border:1px solid #ddd;padding:12px;">${cell.trim()}</td>`;
            });
            table += '</tr>';
        });
        table += '</tbody></table>';
        return table;
    });

    // 箇条書き
    html = html.replace(/^- (.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul style="margin:15px 0;padding-left:25px;">$&</ul>');

    // 水平線
    html = html.replace(/^---$/gm, '<hr style="margin:40px 0;border:none;border-top:1px solid #ddd;">');

    // 段落
    html = html.replace(/\n\n+/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // 空のpタグを削除
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p>(<h[1-4]>)/g, '$1');
    html = html.replace(/(<\/h[1-4]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<table)/g, '$1');
    html = html.replace(/(<\/table>)<\/p>/g, '$1');
    html = html.replace(/<p>(<hr)/g, '$1');
    html = html.replace(/(>)<\/p>/g, '$1');
    html = html.replace(/<p>(<p style)/g, '$1');

    return html;
}

// WordPress API: ページ更新
function updatePage(pageId, title, content) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            title: title,
            content: content,
            status: 'publish'
        });

        const options = {
            hostname: API_BASE,
            port: 443,
            path: `${API_PAGES}/${pageId}`,
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
                    const response = JSON.parse(responseData);
                    resolve({
                        success: true,
                        pageId: response.id,
                        url: response.link,
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

async function main() {
    console.log('===========================================');
    console.log('Phase 10.x: B2B LP更新スクリプト');
    console.log('===========================================\n');

    try {
        // Markdownファイル読み込み
        console.log('ファイル読み込み中...');
        const markdown = fs.readFileSync(DRAFT_PATH, 'utf8');
        console.log(`  読み込み完了: ${markdown.length} 文字\n`);

        // タイトル抽出
        const titleMatch = markdown.match(/^# (.*)$/m);
        const title = titleMatch ? titleMatch[1] : 'タイ・ベトナム採用の無料相談｜日系企業向け 人材紹介コンサルティング';
        console.log(`タイトル: ${title}\n`);

        // HTML変換
        console.log('HTML変換中...');
        const html = markdownToHtml(markdown);
        console.log(`  変換完了: ${html.length} 文字\n`);

        // WordPress更新
        console.log(`WordPress更新中... (Page ID: ${PAGE_ID})`);
        const result = await updatePage(PAGE_ID, title, html);

        console.log('\n===========================================');
        console.log('更新成功!');
        console.log(`  URL: ${result.url}`);
        console.log(`  更新日時: ${result.modified}`);
        console.log('===========================================');

        // ログ出力
        const logPath = 'C:/Users/siank/Desktop/ClaueCode/logs/phase10x_publish_log.md';
        const logContent = `# Phase 10.x 公開ログ

**実行日時**: ${new Date().toISOString()}

## 更新結果

### B2B LP（全面リライト版）
- **ページID**: ${result.pageId}
- **ステータス**: 成功
- **URL**: ${result.url}
- **更新日時**: ${result.modified}

## リライト内容

- B2B専用に完全特化（求職者向け要素を全削除）
- CTAリンクを問い合わせフォームに統一（Tel/Email削除）
- 人材紹介会社選定の5軸比較表を追加
- FAQ 5問を追加
- 信頼性担保ブロック（情報根拠・更新履歴）を追加

## 公開後チェックリスト

- [ ] ページが正常に表示されることを確認
- [ ] CTAリンクが正常に動作することを確認
- [ ] モバイル表示の確認
- [ ] Search Console で URL検査実行
`;

        const logDir = path.dirname(logPath);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        fs.writeFileSync(logPath, logContent, 'utf8');
        console.log(`\nログファイル: ${logPath}`);

    } catch (err) {
        console.error('\nエラー発生:', err.message);
        process.exit(1);
    }
}

main();
