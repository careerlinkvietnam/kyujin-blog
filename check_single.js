const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');
const postId = process.argv[2] || 7998;

const options = {
    hostname: 'kyujin.careerlink.asia',
    port: 443,
    path: `/blog/wp-json/wp/v2/posts/${postId}?context=edit`,
    method: 'GET',
    headers: { 'Authorization': `Basic ${auth}` }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const post = JSON.parse(data);
        const content = post.content?.raw || '';

        console.log('Post ID:', postId);
        console.log('Title:', post.title?.rendered);
        console.log('Content length:', content.length);
        console.log('');

        // Check for unclosed tags
        const divOpens = (content.match(/<div/gi) || []).length;
        const divCloses = (content.match(/<\/div>/gi) || []).length;
        console.log('Div tags - Open:', divOpens, 'Close:', divCloses, (divOpens === divCloses ? 'OK' : 'MISMATCH!'));

        const pOpens = (content.match(/<p/gi) || []).length;
        const pCloses = (content.match(/<\/p>/gi) || []).length;
        console.log('P tags - Open:', pOpens, 'Close:', pCloses, (pOpens === pCloses ? 'OK' : 'MISMATCH!'));

        // Check for layout-breaking issues
        if (content.includes('style="width: 100vw"') || content.includes('style="width:100vw"')) {
            console.log('WARNING: Contains 100vw width');
        }
        if (content.includes('position: fixed') || content.includes('position:fixed')) {
            console.log('WARNING: Contains fixed positioning');
        }
        if (content.includes('float: left') || content.includes('float:left')) {
            console.log('Contains float: left');
        }
        if (content.includes('float: right') || content.includes('float:right')) {
            console.log('Contains float: right');
        }

        // Show first 2000 chars
        console.log('\n=== Content Preview ===');
        console.log(content.substring(0, 2000));
    });
});
req.end();
