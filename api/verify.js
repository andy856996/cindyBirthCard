/**
 * Vercel Serverless Function: api/verify.js
 * 賀卡安全驗證 API - 確保賀卡敏感文字、私密照片與祝詞不暴露在前端原始碼中
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

    // 3. 比對環境變數中的生日密碼 (預設為 0928)
    const expectedPassword = process.env.BIRTHDAY_PASSWORD || '20260928';

    if (!password || String(password).trim() !== String(expectedPassword).trim()) {
      return res.status(401).json({
        success: false,
        error: '密碼錯誤！請輸入專屬通關密碼 🔑'
      });
    }

    // 4. 驗證成功：安全回傳賀卡專屬資料 (不在前端寫死)
    const cardData = {
      title: "Happy Birthday, Cindy! 🎂✨",
      recipient: "Cindy",
      badge: "Special Edition · iOS Birthday App",
      greeting: "親愛的 Cindy：祝妳生日快樂！",
      subtitle: "願新的一歲，奔赴星海，萬物明朗，所求皆所願。",
      message: [
        "今天是屬於妳最特別的日子！願所有的溫柔與好運，都在這一刻如約而至。🌸",
        "感謝有妳在身邊的每一段時光，為生活帶來無數歡笑與燦爛回憶。無論世界怎麼變，妳永遠是最閃閃發光、最獨特的存在。",
        "願新的一歲裡：有喝不完的好茶、吃不胖的甜點、想去就去的旅行，以及永遠溫暖而堅定的陪伴。Happy Birthday! 🎉🥂"
      ],
      signature: "With Endless Love & Blessings ❤️",
      date: "March 22",
      photos: [
        {
          url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80",
          caption: "✨ 每一刻珍貴的歡聚時光，都是最閃亮的記憶"
        },
        {
          url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80",
          caption: "🎈 願妳的笑容永遠如晴空般明媚燦爛"
        },
        {
          url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=80",
          caption: "🍰 吹滅蠟燭的這一刻，願妳許下的所有願望都一一成真"
        }
      ],
      wishes: [
        { icon: "✨", text: "萬事順遂，被愛與幸運包圍" },
        { icon: "✈️", text: "去更多美麗的地方，看更遼闊的風景" },
        { icon: "🍰", text: "永遠保持少女心與探索世界的好奇" },
        { icon: "🐱", text: "每天都有可愛貓咪與毛孩療癒身心" }
      ]
    };

    return res.status(200).json({
      success: true,
      cardData
    });
  } catch (error) {
    console.error('Verify Handler Error:', error);
    return res.status(500).json({
      success: false,
      error: '伺服器發生異常，請稍後再試。'
    });
  }
}
