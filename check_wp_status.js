const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// Check plugins (requires admin access)
const checkEndpoint = (path, name) => {
    return new Promise((resolve) => {
        const options = {
            hostname: 'kyujin.careerlink.asia',
            port: 443,
            path: '/blog/wp-json' + path,
            method: 'GET',
            headers: { 'Authorization': `Basic ${auth}` }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log(`\n=== ${name} ===`);
                console.log('Status:', res.statusCode);
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        if (Array.isArray(json)) {
                            console.log('Count:', json.length);
                            json.slice(0, 10).forEach(item => {
                                console.log('-', item.name || item.slug || item.title?.rendered || JSON.stringify(item).substring(0, 50));
                            });
                        } else {
                            console.log(JSON.stringify(json, null, 2).substring(0, 500));
                        }
                    } catch (e) {
                        console.log(data.substring(0, 200));
                    }
                } else {
                    console.log('Access denied or not available');
                }
                resolve();
            });
        });
        req.on('error', (e) => {
            console.log(`${name}: Error -`, e.message);
            resolve();
        });
        req.end();
    });
};

async function main() {
    // Check various endpoints
    await checkEndpoint('/wp/v2/plugins', 'Plugins');
    await checkEndpoint('/wp/v2/themes', 'Themes');
    await checkEndpoint('/', 'API Root Info');
}

main();
