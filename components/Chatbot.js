'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './Chatbot.module.css';

export default function Chatbot({ onLog }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Xin chào! Tôi là trợ lý ảo SmartPaws. Tôi có thể giúp gì cho bạn về máy cho ăn Kibble?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && onLog) {
      onLog('click', 'Mở khung chat tư vấn Chatbot');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom when messages list updates
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    if (onLog) {
      onLog('click', `Gửi tin nhắn: "${userMessage.content}"`);
      onLog('api_post', 'Đang gửi tin nhắn truy vấn đến Gemini API `/api/chat`...');
    }

    try {
      const chatHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Không nhận được phản hồi');
      }

      setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
      if (onLog) onLog('api_success', `Nhận câu trả lời từ Gemini: "${data.reply}"`);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: 'Rất tiếc, kết nối của tôi đang bị gián đoạn. Bạn vui lòng thử lại sau nhé!' 
      }]);
      if (onLog) onLog('api_error', `Lỗi kết nối Chatbot: "${err.message}"`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Floating button */}
      <button 
        className={styles.launcher} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open support chat"
      >
        💬
      </button>

      {/* Chatbox panel */}
      {isOpen && (
        <div className={styles.chatbox}>
          <div className={styles.header}>
            <div className={styles.avatar}>🐾</div>
            <div>
              <div className={styles.name}>Trợ lý SmartPaws</div>
              <div className={styles.status}>🟢 Đang hoạt động</div>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>&times;</button>
          </div>

          <div className={styles.messagesList}>
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`${styles.messageItem} ${m.role === 'user' ? styles.userMessage : styles.botMessage}`}
              >
                <div className={styles.messageBubble}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className={`${styles.messageItem} ${styles.botMessage}`}>
                <div className={`${styles.messageBubble} ${styles.loadingBubble}`}>
                  <span>●</span><span>●</span><span>●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className={styles.inputForm} onSubmit={handleSend}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..." 
              disabled={loading}
            />
            <button type="submit" disabled={!input.trim() || loading}>Gửi</button>
          </form>
        </div>
      )}
    </div>
  );
}
