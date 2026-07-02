'use client';
import { useState } from 'react';
import styles from './LeadForm.module.css';

export default function LeadForm({ onLog }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' }); // type: 'success' | 'error' | 'loading'

  const logEvent = (type, message) => {
    if (onLog) onLog(type, message);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Họ tên phải tối thiểu 2 ký tự';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Email không đúng định dạng';
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Số điện thoại phải từ 10-11 chữ số';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    logEvent('click', 'Người dùng click gửi Form Đăng Ký');

    if (!validate()) {
      logEvent('validation', 'Dữ liệu nhập không hợp lệ: ' + JSON.stringify(errors));
      return;
    }

    setStatus({ type: 'loading', message: 'Đang gửi dữ liệu đăng ký...' });
    logEvent('api_post', 'Đang gửi dữ liệu đến API `/api/slack`...');

    try {
      const res = await fetch('/api/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Try reading as JSON first
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gửi đăng ký thất bại');
      }

      setStatus({ type: 'success', message: data.message });
      setFormData({ name: '', email: '', phone: '' });
      logEvent('api_success', `Bắn Webhook thành công! Phản hồi từ server: "${data.message}"`);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
      logEvent('api_error', `Bắn Webhook thất bại: "${err.message}"`);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="name">Họ và tên</label>
        <input 
          type="text" 
          id="name"
          name="name" 
          value={formData.name}
          onChange={handleChange}
          placeholder="Ví dụ: Nguyễn Văn A"
          className={errors.name ? styles.inputError : ''}
        />
        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email">Địa chỉ Email</label>
        <input 
          type="email" 
          id="email"
          name="email" 
          value={formData.email}
          onChange={handleChange}
          placeholder="example@gmail.com"
          className={errors.email ? styles.inputError : ''}
        />
        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="phone">Số điện thoại</label>
        <input 
          type="tel" 
          id="phone"
          name="phone" 
          value={formData.phone}
          onChange={handleChange}
          placeholder="09xxxxxxxx"
          className={errors.phone ? styles.inputError : ''}
        />
        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
      </div>

      <button 
        type="submit" 
        className={styles.submitBtn}
        disabled={status.type === 'loading'}
      >
        {status.type === 'loading' ? 'Đang gửi...' : 'Nhận Mã Ưu Đãi 35%'}
      </button>

      {status.message && (
        <div className={`${styles.statusMessage} ${styles[status.type]}`}>
          {status.type === 'success' ? '🎉' : status.type === 'error' ? '❌' : '⏳'} {status.message}
        </div>
      )}
    </form>
  );
}
