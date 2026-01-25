const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

async function main() {
    // Fetch
    const getOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/posts/7702?context=edit',
        method: 'GET',
        headers: { 'Authorization': `Basic ${auth}` }
    };

    const post = await new Promise((resolve) => {
        const req = https.request(getOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.end();
    });

    let content = post.content.raw;
    console.log('Original length:', content.length);

    const searchText = 'ベトナムで働くことに興味はありませんか';
    const idx = content.indexOf(searchText);
    console.log('Found at position:', idx);

    if (idx === -1) {
        console.log('Legacy CTA not found!');
        return;
    }

    // Look backwards to find the start of this CTA section
    // Starting with the comment <!-- CTA -->
    const ctaComment = '<p><!-- CTA --></p>';
    const commentIdx = content.lastIndexOf(ctaComment, idx);
    console.log('Comment at:', commentIdx);

    // Find the div with background gradient
    const bgPattern = 'background: linear-gradient(135deg, #1565c0';
    let divStart = content.lastIndexOf('<div style="', idx);
    while (divStart > -1) {
        const divTag = content.substring(divStart, content.indexOf('>', divStart) + 1);
        if (divTag.includes(bgPattern)) {
            break;
        }
        divStart = content.lastIndexOf('<div style="', divStart - 1);
    }

    console.log('Div start at:', divStart);

    if (divStart === -1) {
        console.log('Could not find CTA div!');
        return;
    }

    // Include the comment if it's right before
    let removeStart = divStart;
    if (commentIdx > -1 && divStart - commentIdx < 50) {
        removeStart = commentIdx;
    }

    // Count divs to find the correct closing
    let divCount = 1;
    let pos = content.indexOf('>', divStart) + 1;

    while (divCount > 0 && pos < content.length) {
        const nextOpen = content.indexOf('<div', pos);
        const nextClose = content.indexOf('</div>', pos);

        if (nextClose === -1) break;

        if (nextOpen !== -1 && nextOpen < nextClose) {
            divCount++;
            pos = nextOpen + 4;
        } else {
            divCount--;
            if (divCount === 0) {
                const removeEnd = nextClose + 6;
                console.log('Remove from', removeStart, 'to', removeEnd);
                console.log('Removing', removeEnd - removeStart, 'chars');

                content = content.substring(0, removeStart) + content.substring(removeEnd);
                break;
            }
            pos = nextClose + 6;
        }
    }

    console.log('New length:', content.length);

    // Verify
    if (content.includes(searchText)) {
        console.log('ERROR: Legacy CTA still present!');
        return;
    }

    // Update
    const postData = JSON.stringify({ content: content });
    const postOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/posts/7702',
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const result = await new Promise((resolve) => {
        const req = https.request(postOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve({ status: res.statusCode }));
        });
        req.write(postData);
        req.end();
    });

    if (result.status === 200) {
        console.log('Updated successfully');
    } else {
        console.log('Error:', result.status);
    }
}

main();
