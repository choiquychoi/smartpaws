import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.log('GEMINI_API_KEY is not configured. Returning simulated response.');
      return NextResponse.json({ 
        reply: 'Xin chào! API Key của Gemini hiện chưa được cấu hình. Tôi là Bot mô phỏng của SmartPaws: PawsFeed AI có giá ưu đãi là 2.590.000đ (bản Pro) và 2.290.000đ (bản Standard). Cần hỗ trợ thêm gì hãy nhắn cho tôi nhé!'
      });
    }

    const promptContext = `Bạn là Trợ lý ảo tư vấn khách hàng của thương hiệu thiết bị thú cưng SmartPaws. 
    Sản phẩm bạn tư vấn là Máy cho ăn thông minh PawsFeed AI. 
    Thông tin sản phẩm:
    - Giá bán: Bản Standard giá 2.290.000đ (giá gốc 3.490.000đ), bản Premium Combo/Pro giá 2.590.000đ (kèm khay inox tháo rời và 3 gói hút ẩm).
    - Tính năng nổi bật: Camera AI 1080p giám sát thời gian thực và nhận diện khuôn mặt thú cưng, cảm biến cân trọng lượng định lượng hạt chính xác ±1g chống béo phì, thiết kế bánh răng silicon chống kẹt hạt, khóa ẩm 3 lớp bảo quản hạt luôn giòn tươi ngon. Có pin dự phòng hoạt động 15 ngày khi mất điện.
    - Bảo hành: 12 tháng chính hãng từ SmartPaws. Đổi trả trong 30 ngày nếu có lỗi sản xuất.
    Hãy trả lời thân thiện, ngắn gọn và hữu ích bằng tiếng Việt. Tránh câu trả lời quá dài dòng. 
    Dưới đây là hội thoại với khách hàng:`;

    // Map conversation array to simple text layout for Gemini
    const dialog = messages.map(m => `${m.role === 'user' ? 'Khách' : 'Trợ lý'}: ${m.content}`).join('\n');
    const fullPrompt = `${promptContext}\n\n${dialog}\nTrợ lý:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${errText}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tôi gặp khó khăn khi phản hồi. Xin vui lòng thử lại sau.';
    
    return NextResponse.json({ reply: reply.trim() });
  } catch (err) {
    return NextResponse.json({ error: 'Lỗi máy chủ: ' + err.message }, { status: 500 });
  }
}
