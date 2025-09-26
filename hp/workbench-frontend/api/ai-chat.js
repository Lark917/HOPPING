// Vercel Serverless Function for AI Chat
export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只接受POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model = 'moonshot-v1-8k', temperature = 0.7, max_tokens = 1000 } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    console.log('收到AI请求，消息数量:', messages.length);
    console.log('模型:', model);

    // 从环境变量获取API密钥
    const apiKey = process.env.KIMI_API_KEY;
    if (!apiKey) {
      console.error('KIMI_API_KEY未配置');
      return res.status(500).json({ error: 'API密钥未配置' });
    }

    // 转发请求到Kimi API
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream: false
      })
    });

    console.log('Kimi API响应状态:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Kimi API error:', response.status, errorData);
      return res.status(response.status).json({ 
        error: 'Kimi API error',
        details: errorData 
      });
    }

    const data = await response.json();
    console.log('Kimi API响应成功，选择数量:', data.choices?.length);
    res.json(data);

  } catch (error) {
    console.error('AI代理错误:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}