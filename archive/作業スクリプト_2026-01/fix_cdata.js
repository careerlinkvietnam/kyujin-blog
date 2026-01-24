const fs = require('fs');
const path = require('path');

const DRAFT_FOLDER = 'C:/Users/siank/Desktop/ClaueCode/draft';

// CDATAタグを含むファイルを修正
const files = fs.readdirSync(DRAFT_FOLDER).filter(f => f.endsWith('.html'));

let fixedCount = 0;

files.forEach(filename => {
    const filePath = path.join(DRAFT_FOLDER, filename);
    let content = fs.readFileSync(filePath, 'utf8');

    // CDATA タグを検出
    if (content.includes('<![CDATA[') || content.includes(']]>')) {
        // CDATAタグを削除
        content = content.replace(/<!\[CDATA\[/g, '');
        content = content.replace(/\]\]>/g, '');

        // 先頭・末尾の空白をトリム
        content = content.trim();

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[修正] ${filename}`);
        fixedCount++;
    }
});

console.log(`\n合計 ${fixedCount} ファイルを修正しました`);
