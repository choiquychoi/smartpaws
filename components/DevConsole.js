'use client';
import { useState } from 'react';
import styles from './DevConsole.module.css';

export default function DevConsole({ logs = [], onClear }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={`${styles.console} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.header} onClick={() => setCollapsed(!collapsed)}>
        <span>🛠️ SmartPaws Dev Console</span>
        <button className={styles.toggleBtn}>{collapsed ? '▲ Hiện' : '▼ Ẩn'}</button>
      </div>
      {!collapsed && (
        <div className={styles.body}>
          <div className={styles.meta}>
            <button onClick={onClear} className={styles.clearBtn}>Xóa log</button>
            <span className={styles.status}>🟢 Live Tracking</span>
          </div>
          <div className={styles.logList}>
            {logs.map((log, idx) => (
              <div key={idx} className={styles.logItem}>
                <span className={styles.time}>{log.time}</span>
                <span className={`${styles.type} ${styles[log.type] || styles.default}`}>
                  [{log.type.toUpperCase()}]
                </span>
                <span className={styles.message}>{log.message}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <div className={styles.empty}>
                Chưa có sự kiện nào được ghi nhận. Hãy cuộn trang hoặc nhấp chuột để bắt đầu kiểm tra hành vi!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
