'use client';
import { useEffect, useState, useCallback } from 'react';
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
  const [scrollY, setScrollY] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

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

  const [toasts, setToasts] = useState([]);

  const addLog = useCallback((type, message) => {
    console.log(`[${type.toUpperCase()}] ${message}`);

    // Track scroll & click silently in the DevConsole, do not show popup notifications to users
    if (type === 'scroll' || type === 'click') {
      return;
    }

    // Map log types to rich icons and titles
    let icon = 'ℹ️';
    let title = 'Hành vi';
    if (type === 'scroll') {
      icon = '📜';
      title = 'Cuộn trang';
    } else if (type === 'click') {
      icon = '🖱️';
      title = 'Click chuột';
    } else if (type === 'validation') {
      icon = '⚠️';
      title = 'Kiểm tra dữ liệu';
    } else if (type === 'api_post') {
      icon = '⏳';
      title = 'Gửi Webhook';
    } else if (type === 'api_success') {
      icon = '✅';
      title = 'Webhook thành công';
    } else if (type === 'api_error') {
      icon = '❌';
      title = 'Webhook lỗi';
    }

    const newToast = {
      id: Date.now() + Math.random(),
      type,
      title,
      icon,
      message
    };

    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3500);
  }, []);

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

  // Combined High-Performance Scroll Event Listener (Parallax & Active Steps)
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
      const sy = window.scrollY;
      setScrollY(sy);

      // 1. Scroll percentage calculation
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollPercent((sy / totalHeight) * 100);
      }

      // 2. Active timeline step calculation
      const steps = document.querySelectorAll(`.${styles.timelineItem}`);
      let currentStep = 0;
      steps.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        // Trigger active when item is in the central viewport sweep (top < 65% height, bottom > 15% height)
        if (rect.top < window.innerHeight * 0.65 && rect.bottom > window.innerHeight * 0.15) {
          currentStep = index + 1;
        }
      });
      if (currentStep > 0) {
        setActiveStep(currentStep);
      }

      // 3. Section log tracking
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger once on mount
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
      answer: "Kibble được trang bị chip nhớ lưu lịch trình cho ăn tại chỗ và khoang chứa pin dự phòng (4 pin D). Khi mất Wi-Fi hay mất điện, thiết bị vẫn tự động nhả hạt chính xác theo đúng khung giờ đã thiết lập, bảo vệ sức khỏe của thú cưng." 
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
      {/* SCROLL PROGRESS BAR */}
      <div 
        className={styles.scrollProgress} 
        style={{ width: `${scrollPercent}%` }} 
      />

      {/* PARALLAX GLOW BLOBS */}
      <div 
        className={styles.parallaxBlob1} 
        style={{ transform: `translateY(${scrollY * 0.15}px)` }} 
      />
      <div 
        className={styles.parallaxBlob2} 
        style={{ transform: `translateY(${scrollY * -0.08}px)` }} 
      />
      <div 
        className={styles.parallaxBlob3} 
        style={{ transform: `translateY(${scrollY * 0.12}px)` }} 
      />

      {/* 1. HERO SECTION (Attention) */}
      <section id="hero" className={`${styles.hero} ${styles.fadeSection}`}>
        <div className={styles.container}>
          <div className={styles.heroContainer}>
            <div className={styles.heroContent}>
              <h1>SmartPaws <span>Kibble</span></h1>
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
                alt="SmartPaws Kibble Pro" 
                width={500} 
                height={350} 
                className={styles.heroImage}
                priority
                sizes="(max-width: 768px) 100vw, 500px"
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
              <div className={styles.metricValue}>5,000+</div>
              <p>Khách hàng tin dùng</p>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricValue}>98%</div>
              <p>Khách hàng hài lòng</p>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricValue}>4.9/5.0★</div>
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
            Không chỉ là máy cho ăn tự động, Kibble mang đến công nghệ chăm sóc toàn diện chuẩn y khoa.
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

      {/* 3.5 SCROLLYTELLING SECTION (A day with Kibble) */}
      <section id="journey" className={styles.journey}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Một ngày hạnh phúc cùng Kibble</h2>
          <p className={styles.sectionSubtitle}>
            Hãy cùng xem cách Kibble đồng hành chăm sóc sức khỏe cho bé cưng của bạn suốt 24 giờ nhé!
          </p>

          <div className={styles.timeline}>
            <div className={styles.timelineLine} />

            <div className={`${styles.timelineItem} ${styles.left} ${activeStep === 1 ? styles.activeTimeline : ''}`}>
              <div className={styles.timelineTime}>06:00</div>
              <div className={`${styles.timelineContent} glass-card`}>
                <span className={styles.timelineIcon}>🌅</span>
                <h3>Bữa Sáng Tươi Ngon</h3>
                <p>Kibble tự động nhả hạt đúng liều lượng đã thiết lập. Khay inox kháng khuẩn sạch sẽ giúp bé sẵn sàng cho ngày mới năng động.</p>
              </div>
            </div>

            <div className={`${styles.timelineItem} ${styles.right} ${activeStep === 2 ? styles.activeTimeline : ''}`}>
              <div className={styles.timelineTime}>12:00</div>
              <div className={`${styles.timelineContent} glass-card`}>
                <span className={styles.timelineIcon}>📷</span>
                <h3>Ngắm Bé Ăn Trưa</h3>
                <p>Bạn đang đi làm? Chỉ cần mở app SmartPaws, camera AI 1080p góc rộng sẽ stream trực tiếp hình ảnh bé ăn trưa giòn rụm cực đáng yêu.</p>
              </div>
            </div>

            <div className={`${styles.timelineItem} ${styles.left} ${activeStep === 3 ? styles.activeTimeline : ''}`}>
              <div className={styles.timelineTime}>18:00</div>
              <div className={`${styles.timelineContent} glass-card`}>
                <span className={styles.timelineIcon}>⚖️</span>
                <h3>Kiểm Soát Cân Nặng</h3>
                <p>Cảm biến cân hạt dưới khay đo lường lượng hạt thừa chính xác đến ±1g, tự động điều chỉnh lượng hạt bữa tối để chống béo phì.</p>
              </div>
            </div>

            <div className={`${styles.timelineItem} ${styles.right} ${activeStep === 4 ? styles.activeTimeline : ''}`}>
              <div className={styles.timelineTime}>22:00</div>
              <div className={`${styles.timelineContent} glass-card`}>
                <span className={styles.timelineIcon}>🌙</span>
                <h3>Yên Tâm Ngủ Ngon</h3>
                <p>Kích hoạt chế độ hồng ngoại ban đêm giúp bạn theo dõi hoạt động của bé trong bóng tối. Bánh răng silicon tự khóa ẩm giữ hạt luôn tươi.</p>
              </div>
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
              <h3>Kibble Standard</h3>
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
                  onClick={() => handleAddToCart({ id: 'std', name: 'Kibble Standard', price: 2290000 })}
                >
                  Thêm vào giỏ
                </button>
                <button 
                  className="neon-button-secondary"
                  style={{ padding: '1rem', width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => handleWishlistToggle({ id: 'std', name: 'Kibble Standard', price: 2290000 })}
                  title="Yêu thích"
                >
                  {wishlist.some(item => item.id === 'std') ? '❤️' : '🤍'}
                </button>
              </div>
            </div>

            {/* AI Pro Plan */}
            <div className={`${styles.pricingCard} ${styles.popularCard}`}>
              <div className={styles.popularTag}>BÁN CHẠY NHẤT</div>
              <h3>Kibble Pro</h3>
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
                  onClick={() => handleAddToCart({ id: 'pro', name: 'Kibble Pro', price: 2590000 })}
                >
                  Thêm vào giỏ
                </button>
                <button 
                  className="neon-button-secondary"
                  style={{ padding: '1rem', width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: 'var(--accent-primary)' }}
                  onClick={() => handleWishlistToggle({ id: 'pro', name: 'Kibble Pro', price: 2590000 })}
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
      {/* FLOATING TOAST NOTIFICATIONS */}
      <div className={styles.toastContainer}>
        {toasts.map(toast => (
          <div key={toast.id} className={`${styles.toast} ${styles[toast.type] || ''} glass-card`}>
            <span className={styles.toastIcon}>{toast.icon}</span>
            <div className={styles.toastBody}>
              <div className={styles.toastTitle}>{toast.title}</div>
              <div className={styles.toastMessage}>{toast.message}</div>
            </div>
            <button 
              className={styles.toastClose} 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
