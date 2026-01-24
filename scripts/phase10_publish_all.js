/**
 * Phase 10: WordPress一括公開スクリプト
 * - 6992, 6804: 既存記事を更新
 * - Phase 7 チェックリスト: 新規投稿として作成
 *
 * 実行方法: node scripts/phase10_publish_all.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// WordPress API設定
const API_BASE = 'kyujin.careerlink.asia';
const API_POSTS = '/blog/wp-json/wp/v2/posts';
const AUTH = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// 公開対象
const UPDATES = [
    {
        type: 'update',
        id: 6992,
        title: 'タイの人材紹介会社一覧【2026年版・掲載基準明示】',
        draftPath: 'C:/Users/siank/Desktop/ClaueCode/articles/6992/v2026_draft.md'
    },
    {
        type: 'update',
        id: 6804,
        title: 'ベトナムの人材紹介会社一覧【2026年版・掲載基準明示】',
        draftPath: 'C:/Users/siank/Desktop/ClaueCode/articles/6804/v2026_draft.md'
    },
    {
        type: 'create',
        slug: 'thailand-recruitment-checklist-b2b',
        title: 'タイ人材採用で失敗しないための「人事担当者向けチェックリスト（相談前）」',
        draftPath: 'C:/Users/siank/Desktop/ClaueCode/articles/phase7/th_recruitment_checklist_b2b.md'
    },
    {
        type: 'create',
        slug: 'vietnam-recruitment-checklist-b2b',
        title: 'ベトナム人材採用で失敗しないための「人事担当者向けチェックリスト（相談前）」',
        draftPath: 'C:/Users/siank/Desktop/ClaueCode/articles/phase7/vn_recruitment_checklist_b2b.md'
    }
];

// 簡易Markdown→HTML変換
function markdownToHtml(md) {
    let html = md;

    // フロントマターを削除（---で囲まれた部分）
    html = html.replace(/^---[\s\S]*?---\n*/m, '');

    // Draft用メタ情報を削除
    html = html.replace(/\*\*ステータス\*\*:.*\n/g, '');
    html = html.replace(/\*\*作成日\*\*:.*\n/g, '');
    html = html.replace(/\*\*公開禁止\*\*:.*\n/g, '');
    html = html.replace(/\*\*文字数\*\*:.*\n/g, '');
    html = html.replace(/\*\*紹介企業数\*\*:.*\n/g, '');
    html = html.replace(/\*\*記事タイプ\*\*:.*\n/g, '');
    html = html.replace(/\*\*想定読者\*\*:.*\n/g, '');

    // 注意事項セクション（Draft用）を削除
    html = html.replace(/## 注意事項[\s\S]*?---\n*/g, '');
    html = html.replace(/## 注意事項（再掲）[\s\S]*?---\n*/g, '');

    // 末尾のDraft情報を削除
    html = html.replace(/---\n+\*\*作成日\*\*:[\s\S]*$/m, '');

    // 編集部注のブロック引用をスタイル付きdivに変換
    html = html.replace(/> \*\*編集部注\*\*: (.*)/g,
        '<div style="background:#f0f8ff;border-left:4px solid #007bff;padding:15px;margin:20px 0;"><strong>編集部注:</strong> $1</div>');

    // 要確認・要注記のブロック引用
    html = html.replace(/> (※公式サイト上の情報が限定的.*)/g,
        '<div style="background:#fff8e1;border-left:4px solid #ffc107;padding:10px;margin:10px 0;font-size:0.9em;">$1</div>');

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

    // テーブル変換
    html = html.replace(/\|(.+)\|\n\|[-|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, body) => {
        const headers = header.split('|').filter(h => h.trim());
        const rows = body.trim().split('\n').map(row =>
            row.split('|').filter(c => c.trim())
        );

        let table = '<table style="border-collapse:collapse;width:100%;margin:15px 0;">';
        table += '<thead><tr>';
        headers.forEach(h => {
            table += `<th style="border:1px solid #ddd;padding:10px;background:#f5f5f5;">${h.trim()}</th>`;
        });
        table += '</tr></thead><tbody>';
        rows.forEach(row => {
            table += '<tr>';
            row.forEach(cell => {
                table += `<td style="border:1px solid #ddd;padding:10px;">${cell.trim()}</td>`;
            });
            table += '</tr>';
        });
        table += '</tbody></table>';
        return table;
    });

    // 箇条書き
    html = html.replace(/^- (.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // 番号付きリスト
    html = html.replace(/^\d+\. (.*)$/gm, '<li>$1</li>');

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
    html = html.replace(/<p>(<table)/g, '$1');
    html = html.replace(/(<\/table>)<\/p>/g, '$1');
    html = html.replace(/<p>(<div)/g, '$1');
    html = html.replace(/(<\/div>)<\/p>/g, '$1');
    html = html.replace(/<p>(<hr>)<\/p>/g, '$1');

    return html;
}

// WordPress API: 記事更新
function updatePost(postId, title, content) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            title: title,
            content: content,
            status: 'publish'
        });

        const options = {
            hostname: API_BASE,
            port: 443,
            path: `${API_POSTS}/${postId}`,
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
                        type: 'update',
                        postId: response.id,
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

// WordPress API: 新規記事作成
function createPost(slug, title, content) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            slug: slug,
            title: title,
            content: content,
            status: 'publish',
            comment_status: 'closed'
        });

        const options = {
            hostname: API_BASE,
            port: 443,
            path: API_POSTS,
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
                        type: 'create',
                        postId: response.id,
                        slug: response.slug,
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

// ログファイル出力
function writeLog(results) {
    const timestamp = new Date().toISOString();
    const logPath = 'C:/Users/siank/Desktop/ClaueCode/logs/phase10_publish_log.md';

    let log = `# Phase 10 公開ログ\n\n`;
    log += `**実行日時**: ${timestamp}\n\n`;
    log += `## 公開結果\n\n`;

    results.forEach(r => {
        log += `### ${r.title}\n`;
        log += `- **タイプ**: ${r.type === 'update' ? '更新' : '新規作成'}\n`;
        log += `- **記事ID**: ${r.postId}\n`;
        log += `- **ステータス**: ${r.success ? '成功' : '失敗'}\n`;
        if (r.success) {
            log += `- **URL**: ${r.url}\n`;
            log += `- **更新日時**: ${r.modified}\n`;
        } else {
            log += `- **エラー**: ${r.error}\n`;
        }
        log += `\n`;
    });

    log += `## 導線確認\n\n`;
    log += `すべてのCTAが以下のLPにリンクしていることを確認：\n`;
    log += `https://kyujin.careerlink.asia/blog/b2b-recruitment-consulting/\n\n`;

    log += `## 公開後チェックリスト\n\n`;
    log += `- [ ] 各記事のCTAリンクが正常に動作することを確認\n`;
    log += `- [ ] LP（固定ページ）が正常に表示されることを確認\n`;
    log += `- [ ] Search Console で URL検査実行\n`;
    log += `- [ ] 24時間後に表示確認\n`;

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
    console.log('Phase 10: WordPress一括公開スクリプト');
    console.log('===========================================\n');

    const results = [];

    for (const item of UPDATES) {
        console.log(`処理中: ${item.title}`);

        try {
            // Markdownファイル読み込み
            const markdown = fs.readFileSync(item.draftPath, 'utf8');
            console.log(`  ファイル読み込み完了: ${markdown.length} 文字`);

            // HTML変換
            const html = markdownToHtml(markdown);
            console.log(`  HTML変換完了: ${html.length} 文字`);

            let result;
            if (item.type === 'update') {
                // 既存記事更新
                result = await updatePost(item.id, item.title, html);
                console.log(`  更新成功: ${result.url}`);
            } else {
                // 新規記事作成
                result = await createPost(item.slug, item.title, html);
                console.log(`  作成成功: ${result.url}`);
            }

            result.title = item.title;
            results.push(result);

        } catch (err) {
            console.log(`  エラー: ${err.message}`);
            results.push({
                title: item.title,
                type: item.type,
                postId: item.id || 'N/A',
                success: false,
                error: err.message
            });
        }

        console.log('');
    }

    // ログ出力
    const logPath = writeLog(results);
    console.log('===========================================');
    console.log('公開処理完了');
    console.log(`ログファイル: ${logPath}`);
    console.log('===========================================');
}

main().catch(console.error);
