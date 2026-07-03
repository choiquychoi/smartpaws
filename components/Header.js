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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bounceCart, setBounceCart] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setBounceCart(true);
      const timer = setTimeout(() => setBounceCart(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

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
        <Link href="#hero" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
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
            🛒 <span className={`${styles.badge} ${bounceCart ? styles.bounce : ''}`}>{cartCount}</span>
          </button>
          <ThemeToggle />
        </div>

        <button 
          className={styles.burgerBtn} 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
        <nav className={styles.mobileNav}>
          <a href="#features" onClick={() => setIsMenuOpen(false)}>Tính năng</a>
          <a href="#specs" onClick={() => setIsMenuOpen(false)}>Thông số</a>
          <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Báo giá</a>
          <a href="#faq" onClick={() => setIsMenuOpen(false)}>Hỏi đáp</a>
          <a href="#register" className={styles.mobileCta} onClick={() => setIsMenuOpen(false)}>Đăng ký ngay</a>
        </nav>
        
        <div className={styles.mobileActions}>
          <button className={styles.mobileActionBtn} onClick={() => setIsMenuOpen(false)}>
            ❤️ Yêu thích <span className={styles.mobileBadge}>{wishlistCount}</span>
          </button>
          <button className={styles.mobileActionBtn} onClick={() => { setIsMenuOpen(false); setIsCartOpen(true); }}>
            🛒 Giỏ hàng <span className={`${styles.mobileBadge} ${bounceCart ? styles.bounce : ''}`}>{cartCount}</span>
          </button>
          <div className={styles.mobileToggleWrapper}>
            <span>Giao diện:</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
