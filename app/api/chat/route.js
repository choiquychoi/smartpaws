import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemInstruction = `Bạn là Trợ lý ảo tư vấn khách hàng cực kỳ "chất", thông thái và thân thiện của thương hiệu thiết bị thú cưng cao cấp SmartPaws. 
Sản phẩm bạn tư vấn là Máy cho ăn thông minh Kibble. 

THÔNG TIN SẢN PHẨM:
1. Kibble Standard (Cơ Bản): Giá ưu đãi 2.290.000đ (giá gốc 3.490.000đ). Dung tích 3L. Hẹn giờ lịch trình trên ứng dụng di động, khóa ẩm cơ bản, khay ăn Inox tháo rời, bảo hành 12 tháng.
2. Kibble Pro (Cao Cấp): Giá ưu đãi 2.590.000đ (giá gốc 4.290.000đ). Dung tích 4L. Tích hợp Camera AI 1080p xem trực tiếp trên app & nhận diện khuôn mặt thú cưng, cảm biến cân trọng lượng định lượng hạt chính xác ±1g chống béo phì, bánh răng silicon dẻo chống kẹt hạt, khóa ẩm 3 lớp tối ưu, pin dự phòng dùng 15 ngày khi mất điện, bảo hành 12 tháng.

QUY TẮC BẢO MẬT & TƯ VẤN (QUAN TRỌNG):
1. Bạn KHÔNG ĐƯỢC PHÉP hỏi xin, thu thập hay ghi nhận thông tin cá nhân của người dùng (như Họ tên, Số điện thoại, Địa chỉ giao hàng).
2. Nếu người dùng ngỏ ý muốn đặt mua máy hoặc đặt chỗ nhận ưu đãi, hãy lịch sự hướng dẫn họ cuộn xuống phía dưới cùng của trang web và điền thông tin vào "Form Đăng Ký Nhận Ưu Đãi 35%" để bảo mật thông tin tuyệt đối.
3. Không thực hiện thu thập dữ liệu cá nhân hay tự chốt đơn qua ô chat. Chỉ đóng vai trò tư vấn thông số kỹ thuật, giải đáp thắc mắc về sản phẩm.

Mục tiêu: Đem lại niềm vui cho ba mẹ thú cưng, giải đáp nhiệt tình chu đáo về máy cho ăn Kibble, và điều hướng khách hàng đăng ký qua Form chính thức của trang web để bảo vệ thông tin cá nhân.`;

export async function POST(request) {
  try {
    const { messages } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.log('GEMINI_API_KEY is not configured. Returning simulated response.');
      return NextResponse.json({ 
        reply: 'Xin chào! API Key của Gemini hiện chưa được cấu hình. Tôi là Bot tư vấn của SmartPaws: Kibble có giá ưu đãi là 2.590.000đ (bản Pro) và 2.290.000đ (bản Standard). Bạn có thể cuộn xuống cuối trang điền Form đăng ký để nhận ưu đãi nhé!'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
    });

    const chatMessages = messages.filter(m => m.role === 'user' || m.role === 'model');
    const lastUserMsg = chatMessages[chatMessages.length - 1];
    
    // Ensure history starts with a 'user' message as required by Gemini API
    let historyMsgs = chatMessages.slice(0, chatMessages.length - 1);
    const firstUserIndex = historyMsgs.findIndex(m => m.role === 'user');
    if (firstUserIndex !== -1) {
      historyMsgs = historyMsgs.slice(firstUserIndex);
    } else {
      historyMsgs = [];
    }

    const formattedHistory = [];
    for (let i = 0; i < historyMsgs.length; i++) {
      const msg = historyMsgs[i];
      formattedHistory.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(lastUserMsg.content);
    const response = result.response;

    return NextResponse.json({ 
      reply: response.text(),
      order: null
    });

  } catch (err) {
    console.error("Lỗi từ Gemini 2.5 Flash:", err);
    return NextResponse.json({ error: 'Lỗi máy chủ: ' + err.message }, { status: 500 });
  }
}
