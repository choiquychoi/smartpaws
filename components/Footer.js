import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <h3>🐾 SmartPaws</h3>
            <p>Nâng tầm chất lượng cuộc sống cho thú cưng bằng công nghệ hiện đại và thông minh.</p>
          </div>
          <div className={styles.links}>
            <h4>Khám phá</h4>
            <a href="#features">Tính năng</a>
            <a href="#specs">Thông số</a>
            <a href="#pricing">Báo giá</a>
          </div>
          <div className={styles.contact}>
            <h4>Liên hệ hỗ trợ</h4>
            <p>Email: support@smartpaws.vn</p>
            <p>Hotline: 1900 xxxx (Demo)</p>
          </div>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.bottom}>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} SmartPaws. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
