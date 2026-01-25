const fs = require('fs');

const json = JSON.parse(fs.readFileSync('temp_post_7721.json', 'utf8'));
const content = json.content.rendered;

// Find the legacy CTA context - look for "専門家にご相談" with surrounding HTML
const pattern = /[^<]{0,200}専門家にご相談[^<]{0,300}/gi;
let matches = content.match(pattern);
if (matches) {
    matches.forEach((m, i) => {
        console.log(`Match ${i+1}:`);
        console.log(m);
        console.log('---');

        // Find exact position
        const idx = content.indexOf(m);
        console.log(`Position: ${idx} (${((idx/content.length)*100).toFixed(1)}%)`);
        console.log('');
    });
}

// Look for the HTML structure around it
const htmlPattern = /<p[^>]*>[^<]*専門家にご相談[^<]*<\/p>/gi;
const htmlMatches = content.match(htmlPattern);
if (htmlMatches) {
    console.log('=== HTML STRUCTURE ===');
    htmlMatches.forEach(m => console.log(m));
}

// Look for larger block
const blockPattern = /<(?:div|p)[^>]*>(?:[^<]*<[^>]*>)*[^<]*専門家にご相談(?:[^<]*<[^>]*>)*[^<]*<\/(?:div|p)>/gi;
const blockMatches = content.match(blockPattern);
if (blockMatches) {
    console.log('\n=== BLOCK STRUCTURE ===');
    blockMatches.forEach(m => console.log(m));
}

// Show surrounding context
const idx = content.indexOf('専門家にご相談');
if (idx >= 0) {
    console.log('\n=== SURROUNDING 500 CHARS ===');
    console.log(content.substring(Math.max(0, idx - 250), idx + 250));
}
