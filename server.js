/**
 * server.js - 本地零依賴開發預覽伺服器 (Zero-dependency local dev server)
 * 同時支援直接在本地模擬 Vercel Serverless Function (/api/verify) 與靜態資源託管
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import verifyHandler from './api/verify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // 1. 轉發 /api/verify 到 serverless handler
  if (pathname === '/api/verify' || pathname === '/api/verify.js') {
    let bodyData = '';
    req.on('data', chunk => { bodyData += chunk; });
    req.on('end', async () => {
      let parsedBody = {};
      if (bodyData) {
        try {
          parsedBody = JSON.parse(bodyData);
        } catch (e) {
          parsedBody = bodyData;
        }
      }

      const mockReq = {
        method: req.method,
        headers: req.headers,
        body: parsedBody,
        query: Object.fromEntries(parsedUrl.searchParams)
      };

      const mockRes = {
        setHeader: (key, val) => res.setHeader(key, val),
        status: (statusCode) => {
          res.statusCode = statusCode;
          return {
            json: (data) => {
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify(data));
            },
            send: (text) => res.end(text)
          };
        }
      };

      try {
        await verifyHandler(mockReq, mockRes);
      } catch (err) {
        console.error('Server error:', err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    });
    return;
  }

  // 2. 靜態檔案託管 (public 目錄)
  let relativePath = pathname === '/' ? '/index.html' : pathname;
  let filePath = path.join(PUBLIC_DIR, relativePath);

  // 安全防護：避免目錄遍歷
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.statusCode = 403;
    return res.end('403 Forbidden');
  }

  // 若目標為目錄，嘗試讀取該目錄下的 index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
  } else {
    // SPA fallback
    const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
    if (fs.existsSync(fallbackPath)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      fs.createReadStream(fallbackPath).pipe(res);
    } else {
      res.statusCode = 404;
      res.end('404 Not Found');
    }
  }
});

server.listen(PORT, () => {
  console.log(`🎉 Cindy's Birthday Card PWA server running at:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`👉 開發預覽模式: http://localhost:${PORT}/?bypass=true\n`);
});
