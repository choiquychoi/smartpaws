'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import SpecsTable from '@/components/SpecsTable';
import Accordion from '@/components/Accordion';
import LeadForm from '@/components/LeadForm';
import Chatbot from '@/components/Chatbot';
import CartDrawer from '@/components/CartDrawer';
import { useApp } from '@/components/AppContext';
import styles from './page.module.css';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  
  const { 
    cart, 
    wishlist, 
    isCartOpen, 
    setIsCartOpen, 
    addToCart, 
    updateCartQuantity, 
    removeFromCart, 
    toggleWishlist 
  } = useApp();

  const addLog = (type, message) => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Scroll Entrance Animations Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll(`.${styles.fadeSection}`);
    sections.forEach((sec) => observer.observe(sec));

    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
    };
  }, []);

  // Scroll Behavior Tracking
  useEffect(() => {
    const tracked = {
      hero: false,
      features: false,
      specs: false,
      pricing: false,
      faq: false,
      register: false
    };

    const handleScroll = () => {
      const sections = ['hero', 'features', 'specs', 'pricing', 'faq', 'register'];
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && !tracked[id]) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight * 0.7) {
            tracked[id] = true;
            let sectionName = id;
            if (id === 'hero') sectionName = 'Mở đầu (Hero)';
            if (id === 'features') sectionName = 'Tính năng nổi bật (Bento Grid)';
            if (id === 'specs') sectionName = 'Thông số & So sánh';
            if (id === 'pricing') sectionName = 'Giá bán & Ưu đãi';
            if (id === 'faq') sectionName = 'Câu hỏi thường gặp';
            if (id === 'register') sectionName = 'Form đăng ký ưu đãi';

            addLog('scroll', `Cuộn đến Section: ${sectionName}`);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWishlistToggle = (product) => {
    toggleWishlist(product);
    const exists = wishlist.some(item => item.id === product.id);
    addLog('click', `${exists ? 'Xóa' : 'Thêm'} yêu thích: "${product.name}"`);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    addLog('click', `Thêm vào Giỏ hàng: "${product.name}"`);
    setIsCartOpen(true);
  };

  const faqItems = [
    { 
      question: "Mất mạng Wi-Fi hoặc mất điện thì máy có hoạt động không?", 
      answer: "PawsFeed AI được trang bị chip nhớ lưu lịch trình cho ăn tại chỗ và khoang chứa pin dự phòng (4 pin D). Khi mất Wi-Fi hay mất điện, thiết bị vẫn tự động nhả hạt chính xác theo đúng khung giờ đã thiết lập, bảo vệ sức khỏe của thú cưng." 
    },
    { 
      question: "Máy có dễ dàng vệ sinh không?", 
      answer: "Rất dễ dàng! Khay ăn được làm bằng Inox 304 tháo rời độc lập. Bể chứa hạt 4L cũng có thể nhấc rời để lau chùi nhanh chóng. Các bộ phận tiếp xúc thức ăn đều chống bám bẩn và an toàn cho bé." 
    },
    { 
      question: "Tôi có thể cho ăn hạt kích thước lớn không?", 
      answer: "Cánh quạt và bánh răng chia hạt được thiết kế bằng chất liệu Silicon dẻo, đi kèm cảm biến chống kẹt và tự xoay đảo chiều. Thiết bị hỗ trợ tốt các loại hạt khô từ 2mm đến 12mm." 
    },
    { 
      question: "Chính sách bảo hành và đổi trả thế nào?", 
      answer: "Sản phẩm được bảo hành chính hãng 12 tháng từ nhà sản xuất SmartPaws. Hỗ trợ 1-đổi-1 trong vòng 30 ngày nếu phát sinh lỗi kỹ thuật từ nhà sản xuất." 
    }
  ];

  return (
    <main className={styles.main}>
      {/* 1. HERO SECTION (Attention) */}
      <section id="hero" className={`${styles.hero} ${styles.fadeSection}`}>
        <div className={styles.container}>
          <div className={styles.heroContainer}>
            <div className={styles.heroContent}>
              <h1>SmartPaws <span>PawsFeed AI</span></h1>
              <p>
                Trợ lý dinh dưỡng thông minh 24/7 cho thú cưng của bạn. Tự động hóa bữa ăn chuẩn khoa học, giám sát từ xa qua camera AI 1080p và bảo vệ hạt luôn tươi ngon giòn rụm.
              </p>
              <div className={styles.heroActions}>
                <a href="#register" className="neon-button-primary" onClick={() => addLog('click', 'Người dùng click CTA Đăng ký ở Hero')}>Nhận Ưu Đãi 35%</a>
                <a href="#features" className="neon-button-secondary" onClick={() => addLog('click', 'Người dùng click Xem Tính năng ở Hero')}>Khám phá tính năng</a>
              </div>
            </div>
            <div className={styles.heroImageContainer}>
              <Image 
                src="/images/smart_feeder_hero.jpg" 
                alt="SmartPaws PawsFeed AI Pro" 
                width={500} 
                height={350} 
                className={styles.heroImage}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF SECTION */}
      <section className={`${styles.socialProof} ${styles.fadeSection}`}>
        <div className={styles.container}>
          <div className={styles.partners}>
            <div className={styles.partner}>🩺 VetApproved</div>
            <div className={styles.partner}>🐈 PetCare Blog</div>
            <div className={styles.partner}>🐕 PetTech Association</div>
            <div className={styles.partner}>⭐️ PetCare Magazine</div>
          </div>
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <h3>5,000+</h3>
              <p>Khách hàng tin dùng</p>
            </div>
            <div className={styles.metric}>
              <h3>98%</h3>
              <p>Khách hàng hài lòng</p>
            </div>
            <div className={styles.metric}>
              <h3>4.9/5.0★</h3>
              <p>Đánh giá chất lượng</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID FEATURES (Interest & Desire) */}
      <section id="features" className={`${styles.features} ${styles.fadeSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Giải pháp dinh dưỡng thời đại công nghệ</h2>
          <p className={styles.sectionSubtitle}>
            Không chỉ là máy cho ăn tự động, PawsFeed AI mang đến công nghệ chăm sóc toàn diện chuẩn y khoa.
          </p>

          <div className={styles.bentoGrid}>
            <div className={`${styles.bentoCard} glass-card ${styles.card1}`} onClick={() => addLog('click', 'Xem chi tiết tính năng Camera AI')}>
              <div className={styles.cardIcon}>📷</div>
              <h3>Camera AI & Giám sát từ xa 1080p</h3>
              <p>Giám sát trực tiếp quá trình ăn uống của thú cưng qua điện thoại. AI thông minh tự động nhận diện khuôn mặt từng bé mèo, ghi lại nhật ký dinh dưỡng cụ thể.</p>
            </div>
            <div className={`${styles.bentoCard} glass-card ${styles.card2}`} onClick={() => addLog('click', 'Xem chi tiết tính năng Cân định lượng')}>
              <div className={styles.cardIcon}>⚖️</div>
              <h3>Cân điện tử định lượng</h3>
              <p>Cảm biến trọng lượng dưới khay ăn đo lường chính xác đến từng gram thức ăn thừa, tránh gây thừa cân hay béo phì.</p>
            </div>
            <div className={`${styles.bentoCard} glass-card ${styles.card3}`} onClick={() => addLog('click', 'Xem chi tiết tính năng Khóa ẩm')}>
              <div className={styles.cardIcon}>🔒</div>
              <h3>Khóa ẩm 3 lớp tối ưu</h3>
              <p>Giữ hạt luôn thơm ngon giòn rụm với ba tầng bảo vệ: Gioăng cao su nắp, hộp hút ẩm và cửa nhả hạt khép kín chống kiến.</p>
            </div>
            <div className={`${styles.bentoCard} glass-card ${styles.card4}`} onClick={() => addLog('click', 'Xem chi tiết tính năng Bánh răng chống kẹt')}>
              <div className={styles.cardIcon}>⚙️</div>
              <h3>Bánh răng Silicon chống kẹt hạt</h3>
              <p>Hệ thống bánh răng Silicon mềm dẻo chia hạt đều đặn. Cảm biến thông minh tự động đảo chiều xoay nếu phát hiện vật cản kẹt hạt.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SPECIFICATIONS SECTION (Desire) */}
      <section id="specs" className={`${styles.specs} ${styles.fadeSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Thông số kỹ thuật & So sánh</h2>
          <p className={styles.sectionSubtitle}>
            Xem chi tiết các điểm vượt trội và lựa chọn phiên bản phù hợp nhất với Boss yêu của bạn.
          </p>
          <div onClick={() => addLog('click', 'Tương tác với bảng thông số kỹ thuật')}>
            <SpecsTable />
          </div>
        </div>
      </section>

      {/* 5. PRICING & OFFERS SECTION (Desire) */}
      <section id="pricing" className={`${styles.pricing} ${styles.fadeSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Giá bán & Chương trình ưu đãi</h2>
          <p className={styles.sectionSubtitle}>
            Đặt mua sớm ngay hôm nay để nhận ưu đãi giảm giá ra mắt đặc biệt lên đến 35%.
          </p>

          <div className={styles.timerContainer}>
            <p>⏳ CHƯƠNG TRÌNH KHUYẾN MÃI SẼ KẾT THÚC SAU:</p>
            <div className={styles.timer}>
              <div className={styles.timerBlock}>
                <div className={styles.timerVal}>{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className={styles.timerLabel}>Giờ</div>
              </div>
              <div className={styles.timerBlock}>
                <div className={styles.timerVal}>{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className={styles.timerLabel}>Phút</div>
              </div>
              <div className={styles.timerBlock}>
                <div className={styles.timerVal}>{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className={styles.timerLabel}>Giây</div>
              </div>
            </div>
          </div>

          <div className={styles.pricingGrid}>
            {/* Standard Plan */}
            <div className={styles.pricingCard}>
              <h3>PawsFeed Standard</h3>
              <p className={styles.priceDescription}>Dành cho nhu cầu cơ bản, hẹn giờ cho ăn tự động qua điện thoại.</p>
              <div className={styles.priceBlock}>
                <span className={styles.originalPrice}>3.490.000 đ</span>
                <div className={styles.currentPrice}>2.290.000 đ</div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>Dung tích chứa hạt 3L</li>
                <li>Hẹn giờ lịch trình trên ứng dụng</li>
                <li>Công nghệ khóa ẩm cơ bản</li>
                <li>Sử dụng khay Inox cao cấp</li>
                <li>Bảo hành chính hãng 12 tháng</li>
              </ul>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button 
                  className="neon-button-secondary" 
                  style={{ flex: 1 }}
                  onClick={() => handleAddToCart({ id: 'std', name: 'PawsFeed Standard', price: 2290000 })}
                >
                  Thêm vào giỏ
                </button>
                <button 
                  className="neon-button-secondary"
                  style={{ padding: '1rem', width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => handleWishlistToggle({ id: 'std', name: 'PawsFeed Standard', price: 2290000 })}
                  title="Yêu thích"
                >
                  {wishlist.some(item => item.id === 'std') ? '❤️' : '🤍'}
                </button>
              </div>
            </div>

            {/* AI Pro Plan */}
            <div className={`${styles.pricingCard} ${styles.popularCard}`}>
              <div className={styles.popularTag}>BÁN CHẠY NHẤT</div>
              <h3>PawsFeed AI Pro</h3>
              <p className={styles.priceDescription}>Tích hợp Camera AI giám sát và cân định lượng sức khỏe đỉnh cao.</p>
              <div className={styles.priceBlock}>
                <span className={styles.originalPrice}>4.290.000 đ</span>
                <div className={styles.currentPrice}>2.590.000 đ</div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>Dung tích chứa hạt lớn 4L</li>
                <li>Camera AI 1080p giám sát thời gian thực</li>
                <li>Cảm biến trọng lượng cân định lượng hạt ±1g</li>
                <li>Chống kẹt hạt chủ động & Khóa ẩm 3 lớp</li>
                <li>Pin dự phòng hoạt động 15 ngày</li>
                <li>Hỗ trợ Wi-Fi Dual Band (2.4GHz & 5GHz)</li>
              </ul>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button 
                  className="neon-button-primary" 
                  style={{ flex: 1 }}
                  onClick={() => handleAddToCart({ id: 'pro', name: 'PawsFeed AI Pro', price: 2590000 })}
                >
                  Thêm vào giỏ
                </button>
                <button 
                  className="neon-button-secondary"
                  style={{ padding: '1rem', width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: 'var(--accent-primary)' }}
                  onClick={() => handleWishlistToggle({ id: 'pro', name: 'PawsFeed AI Pro', price: 2590000 })}
                  title="Yêu thích"
                >
                  {wishlist.some(item => item.id === 'pro') ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION (Resolution) */}
      <section id="faq" className={`${styles.faq} ${styles.fadeSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Câu hỏi thường gặp</h2>
          <p className={styles.sectionSubtitle}>
            Chúng tôi luôn ở đây để trả lời mọi thắc mắc của bạn về sản phẩm và dịch vụ.
          </p>
          <div onClick={() => addLog('click', 'Tương tác mục câu hỏi thường gặp FAQ')}>
            <Accordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* 7. LEAD FORM SECTION (Action) */}
      <section id="register" className={`${styles.register} ${styles.fadeSection}`}>
        <div className={styles.container}>
          <div className={styles.registerCard}>
            <h2>Đăng Ký Đặt Chỗ Nhận Mã Giảm Giá 35%</h2>
            <p>Hãy để lại thông tin của bạn. Đội ngũ SmartPaws sẽ liên hệ tư vấn và gửi tặng mã ưu đãi sớm nhất.</p>
            <LeadForm onLog={addLog} />
          </div>
        </div>
      </section>

      {/* FLOATING CHATBOT */}
      <Chatbot onLog={addLog} />

      {/* CART DRAWER */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onLog={addLog}
      />
    </main>
  );
}
