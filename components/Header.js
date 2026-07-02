'use client';
import Link from 'next/link';
import { useApp } from './AppContext';
import ThemeToggle from './ThemeToggle';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';

export default function Header() {
  const { cart, wishlist, setIsCartOpen } = useApp();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href="#hero" className={styles.logo}>
          🐾 Smart<span>Paws</span>
        </Link>

        <nav className={styles.nav}>
          <a href="#features">Tính năng</a>
          <a href="#specs">Thông số</a>
          <a href="#pricing">Báo giá</a>
          <a href="#faq">Hỏi đáp</a>
          <a href="#register" className={styles.ctaLink}>Đăng ký ngay</a>
        </nav>

        <div className={styles.actions}>
          <button className={styles.actionBtn} title="Danh sách yêu thích">
            ❤️ <span className={styles.badge}>{wishlistCount}</span>
          </button>
          <button className={styles.actionBtn} onClick={() => setIsCartOpen(true)} title="Giỏ hàng">
            🛒 <span className={styles.badge}>{cartCount}</span>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
