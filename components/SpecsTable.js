'use client';
import { useState } from 'react';
import styles from './SpecsTable.module.css';

export default function SpecsTable() {
  const [activeVersion, setActiveVersion] = useState('pro'); // pro vs standard

  const specs = [
    { name: 'Dung tích chứa', pro: '4.0 Lít (Khoảng 2.0 kg hạt)', standard: '3.0 Lít (Khoảng 1.5 kg hạt)', icon: '📦' },
    { name: 'Camera giám sát', pro: 'AI 1080p góc rộng 140°, Hồng ngoại nhìn đêm, Nhận diện thú cưng', standard: 'Không tích hợp', icon: '📷' },
    { name: 'Cân định lượng', pro: 'Cảm biến trọng lượng thông minh chính xác ±1g', standard: 'Cảm biến thể tích (ước tính lượng hạt)', icon: '⚖️' },
    { name: 'Chống kẹt hạt', pro: 'Bánh răng Silicon tự đảo chiều xoay thông minh', standard: 'Bánh răng nhựa cơ học', icon: '⚙️' },
    { name: 'Khóa ẩm bảo quản', pro: 'Khóa ẩm 3 lớp (Silicon viền nắp, Hộp hút ẩm, Cửa chia hạt tự khóa)', standard: 'Nắp thường kèm hộp hút ẩm', icon: '🔒' },
    { name: 'Pin dự phòng', pro: 'Hoạt động liên tục 15 ngày khi mất điện (Dùng 4 pin D)', standard: 'Không hỗ trợ (Hoặc dùng pin dự phòng ngoài)', icon: '🔋' },
    { name: 'Kết nối ứng dụng', pro: 'Wi-Fi Dual Band (2.4GHz & 5GHz), Báo cáo biểu đồ ăn uống', standard: 'Wi-Fi 2.4GHz chỉ cài lịch trình', icon: '📱' },
    { name: 'Khay ăn', pro: 'Inox 304 kháng khuẩn cao cấp, tháo rời dễ rửa', standard: 'Nhựa kháng khuẩn hoặc Inox thường', icon: '🍽️' },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.toggleContainer}>
        <button 
          className={`${styles.toggleBtn} ${activeVersion === 'pro' ? styles.active : ''}`}
          onClick={() => setActiveVersion('pro')}
        >
          Kibble Pro (Khuyên dùng)
        </button>
        <button 
          className={`${styles.toggleBtn} ${activeVersion === 'standard' ? styles.active : ''}`}
          onClick={() => setActiveVersion('standard')}
        >
          Kibble Standard
        </button>
      </div>

      {/* DYNAMIC PRODUCT PREVIEW CARD */}
      <div className={styles.previewContainer}>
        <div className={`${styles.singleFeederCard} glass-card`}>
          <div className={styles.imageWrapper}>
            <img 
              src={activeVersion === 'pro' ? '/images/pawsfeed_pro.jpg' : '/images/pawsfeed_standard.jpg'} 
              alt={activeVersion === 'pro' ? 'Kibble Pro' : 'Kibble Standard'} 
              className={styles.feederImage}
              loading="lazy"
            />
          </div>
          <div className={styles.cardInfo}>
            <span className={`${styles.badgeLabel} ${activeVersion === 'standard' ? styles.badgeSecondaryLabel : ''}`}>
              {activeVersion === 'pro' ? 'Pro - Cao Cấp' : 'Standard - Cơ Bản'}
            </span>
            <h3>{activeVersion === 'pro' ? 'SmartPaws Kibble Pro' : 'SmartPaws Kibble Standard'}</h3>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Thông số kỹ thuật</th>
              <th>Giá trị ({activeVersion === 'pro' ? 'Bản Pro' : 'Bản Standard'})</th>
              <th>Máy cho ăn truyền thống</th>
            </tr>
          </thead>
          <tbody>
            {specs.map((spec, index) => (
              <tr key={index}>
                <td className={styles.specName}>
                  <span className={styles.icon}>{spec.icon}</span> {spec.name}
                </td>
                <td className={styles.specVal}>
                  {activeVersion === 'pro' ? spec.pro : spec.standard}
                </td>
                <td className={styles.specLegacy}>
                  {index === 0 ? '2.0 Lít - 3.0 Lít' : 
                   index === 1 ? 'Không có camera' :
                   index === 2 ? 'Không có cảm biến' :
                   index === 3 ? 'Dễ kẹt hạt (Bánh răng cứng)' :
                   index === 4 ? 'Nắp hở dễ ẩm mốc' :
                   index === 5 ? 'Ngừng hoạt động khi mất điện' :
                   index === 6 ? 'Nhấn nút cơ trên máy' : 'Nhựa thường dễ gây mụn cằm cho mèo'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
