import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function saveRegistrationToCSV(name, email, phone) {
  const csvPath = path.join(process.cwd(), 'registrations.csv');
  const headers = ['Thời gian', 'Họ tên', 'Email', 'Số điện thoại'];
  const row = [
    new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    `"${name.replace(/"/g, '""')}"`,
    `"${email.replace(/"/g, '""')}"`,
    `"${phone.replace(/"/g, '""')}"`
  ].join(',');

  try {
    if (!fs.existsSync(csvPath)) {
      // Add UTF-8 BOM so Excel opens it with correct Vietnamese diacritics
      fs.writeFileSync(csvPath, '\ufeff' + headers.join(',') + '\n', 'utf8');
    }
    fs.appendFileSync(csvPath, row + '\n', 'utf8');
    console.log(">>> [HỆ THỐNG] ĐÃ LƯU ĐĂNG KÝ VÀO FILE CSV:", csvPath);
  } catch (err) {
    console.error("Lỗi khi lưu đăng ký vào CSV:", err);
  }
}

export async function POST(request) {
  try {
    const { name, email, phone } = await request.json();

    // Server-side validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Tên không hợp lệ (tối thiểu 2 ký tự)' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email không đúng định dạng' }, { status: 400 });
    }
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return NextResponse.json({ error: 'Số điện thoại phải chứa 10-11 chữ số' }, { status: 400 });
    }

    // Save registration to local CSV database
    saveRegistrationToCSV(name.trim(), email.trim(), phone.trim());

    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      // Mock mode for evaluation if webhook url is empty in env
      console.log('SLACK_WEBHOOK_URL is not configured. Mocking success response.');
      return NextResponse.json({ 
        success: true, 
        message: 'Đăng ký thành công! (Chế độ lưu CSV hoạt động, giả lập gửi Slack vì Webhook chưa cấu hình)' 
      });
    }

    const slackPayload = {
      text: `🎉 *Đăng ký mới nhận ưu đãi Kibble!*\n👤 *Họ tên:* ${name.trim()}\n📧 *Email:* ${email.trim()}\n📞 *Điện thoại:* ${phone.trim()}\n⏰ *Thời gian:* ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackPayload),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Gửi Webhook thất bại: ${text}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Đăng ký nhận ưu đãi thành công!' });
  } catch (err) {
    return NextResponse.json({ error: 'Lỗi máy chủ: ' + err.message }, { status: 500 });
  }
}
