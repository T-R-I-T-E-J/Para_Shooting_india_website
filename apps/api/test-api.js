const http = require('http');
const crypto = require('crypto');

(async () => {
    // 1. Register a user on 4000 (direct to API)
    const regReq = http.request('http://localhost:4000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const parsed = JSON.parse(data);
            const token = parsed.access_token || parsed.data?.access_token;
            console.log("Token:", !!token);

            if (!token) return;

            const boundary = '----WebKitFormBoundary' + crypto.randomBytes(16).toString('hex');
            const parts = [
                Buffer.from('--' + boundary + '\r\n'),
                Buffer.from('Content-Disposition: form-data; name="file"; filename="dummy.txt"\r\n'),
                Buffer.from('Content-Type: text/plain\r\n\r\n'),
                Buffer.from('hello world here is my content so it is not empty'),
                Buffer.from('\r\n--' + boundary + '--\r\n')
            ];
            const payload = Buffer.concat(parts);

            // 2. Upload file on 3000 (through Next.js proxy)
            const upReq = http.request('http://localhost:3000/api/v1/upload/file', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data; boundary=' + boundary,
                    'Content-Length': payload.length
                }
            }, (upRes) => {
                let upData = '';
                upRes.on('data', chunk => upData += chunk);
                upRes.on('end', () => {
                    console.log('UPLOAD STATUS on :3000 :', upRes.statusCode);
                    console.log('UPLOAD DATA on :3000 :', upData);
                });
            });

            upReq.on('error', console.error);
            upReq.write(payload);
            upReq.end();
        });
    });

    regReq.on('error', console.error);
    regReq.write(JSON.stringify({email: "test23@example.com", password: "Password123!", first_name: "Test", last_name: "Uploader"}));
    regReq.end();
})();
