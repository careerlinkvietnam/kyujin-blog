const fs = require('fs');

const json = JSON.parse(fs.readFileSync('temp_post_7721.json', 'utf8'));
const content = json.content.rendered;

console.log('Title:', json.title.rendered);
console.log('Total length:', content.length, 'chars');
console.log('');

// Find all h2 headings with their positions
const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
let match;
let headings = [];
while ((match = h2Regex.exec(content)) !== null) {
    const cleanTitle = match[1].replace(/<[^>]*>/g, '');
    headings.push({
        position: match.index,
        percent: ((match.index / content.length) * 100).toFixed(1),
        title: cleanTitle.substring(0, 60)
    });
}

console.log('=== H2 HEADINGS WITH POSITIONS ===');
headings.forEach((h, i) => {
    console.log(`${i+1}. [${h.percent}%] pos:${h.position} - ${h.title}`);
});

// Find existing CTAs
console.log('\n=== EXISTING CTA PATTERNS ===');
const ctaPatterns = [
    /cta-box/gi,
    /cta-jobseeker/gi,
    /cta-hr/gi,
    /cta-lp/gi,
    /東南アジア進出・人材採用のご相談/gi,
    /専門家にご相談/gi,
    /お問い合わせはこちら/gi
];

ctaPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
        console.log(`Pattern "${pattern.source}": ${matches.length} matches`);
    }
});

// Find legacy CTA section
const legacyMatch = content.match(/専門家にご相談[^<]{0,500}/);
if (legacyMatch) {
    console.log('\nLegacy CTA context:', legacyMatch[0].substring(0, 200));
}

// Find related articles or sources section
console.log('\n=== END SECTION ANALYSIS ===');
const relatedMatch = content.match(/<h2[^>]*>.*?関連.*?<\/h2>/gi);
const sourceMatch = content.match(/<h2[^>]*>.*?(出典|参考|まとめ).*?<\/h2>/gi);
if (relatedMatch) console.log('Related articles h2:', relatedMatch);
if (sourceMatch) console.log('Source/Summary h2:', sourceMatch);

// Show last 2000 chars for context
console.log('\n=== LAST 1500 CHARS ===');
console.log(content.substring(content.length - 1500));

// Calculate optimal CTA positions
console.log('\n=== OPTIMAL CTA POSITIONS ===');
const pos1 = Math.round(content.length * 0.15); // 15%
const pos2 = Math.round(content.length * 0.50); // 50%
console.log(`1st CTA target: ~${pos1} chars (15%)`);
console.log(`2nd CTA target: ~${pos2} chars (50%)`);

// Find best h2 for each position
headings.forEach(h => {
    if (Math.abs(h.position - pos1) < 3000) {
        console.log(`  -> Near 15%: ${h.title} at ${h.percent}%`);
    }
    if (Math.abs(h.position - pos2) < 3000) {
        console.log(`  -> Near 50%: ${h.title} at ${h.percent}%`);
    }
});
