const https = require('https');
const fs = require('fs');
const path = require('path');

const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const filePath = path.join(__dirname, '..', 'blog_drafts', '18_ダナン・ホイアンのゴルフ場一覧_2026年版.md');
const markdown = fs.readFileSync(filePath, 'utf-8');

function markdownToHtml(md) {
  let html = md;
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');

  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  let result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHtml = '<table><tbody>';
      }
      if (line.includes('---')) continue;
      const cells = line.split('|').filter(c => c.trim());
      const row = cells.map(c => '<td>' + c.trim() + '</td>').join('');
      tableHtml += '<tr>' + row + '</tr>';
    } else {
      if (inTable) {
        tableHtml += '</tbody></table>';
        result.push(tableHtml);
        inTable = false;
        tableHtml = '';
      }
      result.push(line);
    }
  }
  if (inTable) {
    tableHtml += '</tbody></table>';
    result.push(tableHtml);
  }

  html = result.join('\n');
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<table>)/g, '$1');
  html = html.replace(/(<\/table>)<\/p>/g, '$1');
  html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
  html = html.replace(/<p>(<div)/g, '$1');
  html = html.replace(/(<\/div>)<\/p>/g, '$1');

  return html;
}

const htmlContent = markdownToHtml(markdown);

const postData = JSON.stringify({
  title: 'ダナン・ホイアンのゴルフ場一覧【2026年版】',
  content: htmlContent,
  status: 'draft'
});

const options = {
  hostname: 'kyujin.careerlink.asia',
  path: '/blog/wp-json/wp/v2/posts',
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
      const result = JSON.parse(data);
      if (result.id) {
        console.log('SUCCESS: Post ID = ' + result.id);
        console.log('Title: ' + result.title.rendered);
      } else {
        console.log('Error:', result.message || JSON.stringify(result));
      }
    } catch (e) {
      console.log('Parse error:', e.message, data.substring(0, 200));
    }
  });
});

req.on('error', (e) => console.log('Request error:', e.message));
req.write(postData);
req.end();
