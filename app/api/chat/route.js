import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Tools for Function Calling (100% structured data extraction)
const tools = [{
  functionDeclarations: [{
    name: "createOrder",
    description: "Tạo đơn hàng mua máy cho ăn thông minh Kibble cho khách hàng khi họ đã chốt mua và cung cấp đủ Tên, SĐT, Địa chỉ.",
    parameters: {
      type: "OBJECT",
      properties: {
        name: { 
          type: "STRING", 
          description: "Họ và tên của khách hàng" 
        },
        phone: { 
          type: "STRING", 
          description: "Số điện thoại liên hệ của khách hàng" 
        },
        address: { 
          type: "STRING", 
          description: "Địa chỉ giao hàng đầy đủ" 
        },
        items: { 
          type: "STRING", 
          description: "Danh sách sản phẩm mua (ví dụ: 'Kibble Pro' hoặc 'Kibble Standard', kèm số lượng)" 
        },
        total: { 
          type: "NUMBER", 
          description: "Tổng số tiền đơn hàng tính bằng VNĐ (Kibble Pro: 2.590.000đ, Kibble Standard: 2.290.000đ)" 
        }
      },
      required: ["name", "phone", "address", "items", "total"]
    }
  }]
}];

const systemInstruction = `Bạn là Trợ lý ảo tư vấn khách hàng cực kỳ "chất", thông thái và thân thiện của thương hiệu thiết bị thú cưng cao cấp SmartPaws. 
Sản phẩm bạn tư vấn là Máy cho ăn thông minh Kibble. 

THÔNG TIN SẢN PHẨM:
1. Kibble Standard (Cơ Bản): Giá ưu đãi 2.290.000đ (giá gốc 3.490.000đ). Dung tích 3L. Hẹn giờ lịch trình trên ứng dụng di động, khóa ẩm cơ bản, khay ăn Inox tháo rời, bảo hành 12 tháng.
2. Kibble Pro (Cao Cấp): Giá ưu đãi 2.590.000đ (giá gốc 4.290.000đ). Dung tích 4L. Tích hợp Camera AI 1080p xem trực tiếp trên app & nhận diện khuôn mặt thú cưng, cảm biến cân trọng lượng định lượng hạt chính xác ±1g chống béo phì, bánh răng silicon dẻo chống kẹt hạt, khóa ẩm 3 lớp tối ưu, pin dự phòng dùng 15 ngày khi mất điện, bảo hành 12 tháng.

QUY TRÌNH TIẾP KHÁCH:
1. Giao lưu & Gửi lời chào: Chào đón khách hàng một cách nồng nhiệt, thân thiện (có thể dùng một số từ lóng thú cưng như 'sen', 'boss', 'hoàng thượng', 'ba mẹ', 'bé cưng'...). Hỏi khách xem hôm nay bé nhà mình (chó hay mèo) thế nào để tư vấn dòng máy phù hợp nhất.
2. Tư vấn nhiệt tình: 
   - Hỏi khách về giống thú cưng, độ tuổi, thói quen ăn uống của bé để tư vấn (ví dụ bé hay ăn vụng hoặc cần giảm cân thì dòng Pro có cảm biến cân hạt rất tốt; bố mẹ bận đi làm muốn ngắm bé ăn thì dòng Pro có camera).
   - Nhấn mạnh các tính năng "cháy máy" của bản Pro để tăng tỷ lệ chốt đơn.
3. Chốt đơn hàng:
   - CHỈ khi khách hàng đồng ý chốt mua và cung cấp đầy đủ 3 thông tin: Họ tên, Số điện thoại, và Địa chỉ giao hàng, bạn mới kích hoạt công cụ 'createOrder'.
   - Nếu thiếu bất kỳ thông tin nào trong 3 thông tin trên, hãy khéo léo và lịch sự hỏi khách hàng cung cấp nốt. Không tự ý tạo đơn khi chưa có đủ thông tin.
   - Hãy tính toán tổng tiền chính xác dựa trên sản phẩm khách chọn (Kibble Pro: 2.590.000đ, Kibble Standard: 2.290.000đ).

Mục tiêu: Đem lại niềm vui cho ba mẹ thú cưng, chăm sóc chu đáo cho các bé rồi nổ đơn thật chất nhé!`;

function saveOrderToCSV(order) {
  const csvPath = path.join(process.cwd(), 'orders.csv');
  const headers = ['Thời gian', 'Tên khách', 'Số điện thoại', 'Địa chỉ', 'Món đã gọi', 'Tổng tiền (VNĐ)'];
  const row = [
    new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    `"${order.name.replace(/"/g, '""')}"`,
    `"${order.phone.replace(/"/g, '""')}"`,
    `"${order.address.replace(/"/g, '""')}"`,
    `"${order.items.replace(/"/g, '""')}"`,
    order.total
  ].join(',');

  try {
    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(csvPath, '\ufeff' + headers.join(',') + '\n', 'utf8');
    }
    fs.appendFileSync(csvPath, row + '\n', 'utf8');
    console.log(">>> [HỆ THỐNG] ĐÃ LƯU ĐƠN VÀO FILE CSV:", csvPath);
  } catch (err) {
    console.error("Lỗi khi lưu đơn vào CSV:", err);
  }
}

export async function POST(request) {
  try {
    const { messages } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.log('GEMINI_API_KEY is not configured. Returning simulated response.');
      return NextResponse.json({ 
        reply: 'Xin chào! API Key của Gemini hiện chưa được cấu hình. Tôi là Bot mô phỏng của SmartPaws: Kibble có giá ưu đãi là 2.590.000đ (bản Pro) và 2.290.000đ (bản Standard). Cần hỗ trợ thêm gì hãy nhắn cho tôi nhé!'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: tools,
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

    const calls = response.functionCalls();
    if (calls && calls.length > 0) {
      const call = calls[0];
      if (call.name === "createOrder") {
        console.log(">>> [HỆ THỐNG] ĐÃ CHỐT ĐƠN TỪ CHATBOT:", call.args);
        
        saveOrderToCSV(call.args);
        
        const finalResult = await chat.sendMessage([{
          functionResponse: { 
            name: "createOrder", 
            response: { status: "success" } 
          }
        }]);
        
        return NextResponse.json({ 
          reply: finalResult.response.text(),
          order: call.args
        });
      }
    }

    return NextResponse.json({ 
      reply: response.text(),
      order: null
    });

  } catch (err) {
    console.error("Lỗi từ Gemini 2.5 Flash:", err);
    return NextResponse.json({ error: 'Lỗi máy chủ: ' + err.message }, { status: 500 });
  }
}
