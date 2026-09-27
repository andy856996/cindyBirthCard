/**
 * Vercel Serverless Function: api/verify.js
 * 賀卡安全驗證 API - 確保賀卡敏感文字不暴露在前端原始碼中
 */

export default async function handler(req, res) {
  // 1. 僅允許 POST 請求
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. 僅接受 POST 驗證請求。'
    });
  }

  try {
    // 2. 解析請求內容 (相容 Vercel 自動解析與字串化 payload)
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: '無效的 JSON 請求格式'
        });
      }
    }

    const { password } = body || {};

    // 3. 比對環境變數中的生日密碼
    const expectedPassword = process.env.BIRTHDAY_PASSWORD;

    if (!expectedPassword || !password || String(password).trim() !== String(expectedPassword).trim()) {
      return res.status(401).json({
        success: false,
        error: '小呆瓜！密碼錯誤囉～請輸入專屬通關密碼'
      });
    }

    // 4. 從環境變數讀取 Base64 編碼的賀卡內文並解碼
    const decodedMessage = Buffer.from(process.env.CARD_MESSAGE_BASE64 || '', 'base64').toString('utf-8');

    // 5. 驗證成功：精簡回傳格式
    return res.status(200).json({
      success: true,
      cardData: {
        title: "Happy Birthday! 🎂",
        message: decodedMessage
      }
    });
  } catch (error) {
    console.error('Verify Handler Error:', error);
    return res.status(500).json({
      success: false,
      error: '伺服器發生異常，請稍後再試。'
    });
  }
}
