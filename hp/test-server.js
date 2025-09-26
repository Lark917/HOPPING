const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/test-api.html') {
        fs.readFile(path.join(__dirname, 'test-api.html'), (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(`
            <!DOCTYPE html>
            <html>
            <head><title>API测试</title></head>
            <body>
                <h1>API测试页面</h1>
                <p><a href="/test-api.html">点击这里测试API</a></p>
            </body>
            </html>
        `);
    }
});

server.listen(8080, () => {
    console.log('测试服务器运行在 http://localhost:8080');
});