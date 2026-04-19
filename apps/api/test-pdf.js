const http = require('http');
const crypto = require('crypto');

(async () => {
    // 1. Register a user on 4000
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
            
            // 2. Fake PDF with correct magic bytes (%PDF-1.4)
            const pdfBytes = Buffer.concat([
                Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n'),
                Buffer.from('fake pdf payload')
            ]);
            
            const parts = [
                Buffer.from('--' + boundary + '\r\n'),
                Buffer.from('Content-Disposition: form-data; name="file"; filename="test.pdf"\r\n'),
                Buffer.from('Content-Type: application/pdf\r\n\r\n'),
                pdfBytes,
                Buffer.from('\r\n--' + boundary + '--\r\n')
            ];
            const payload = Buffer.concat(parts);

            // Upload file directly to 4000 to see raw NestJS error if any
            const upReq = http.request('http://localhost:4000/api/v1/upload/file', {
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
                    console.log('UPLOAD STATUS:', upRes.statusCode);
                    console.log('UPLOAD DATA:', upData);
                });
            });

            upReq.on('error', console.error);
            upReq.write(payload);
            upReq.end();
        });
    });

    regReq.on('error', console.error);
    regReq.write(JSON.stringify({email: "test24@example.com", password: "Password123!", first_name: "Test", last_name: "Uploader"}));
    regReq.end();
})();
