'use client';
import styles from './CartDrawer.module.css';

export default function CartDrawer({ isOpen, onClose, cartItems = [], onUpdateQuantity, onRemoveItem, onLog }) {
  if (!isOpen) return null;

  const logEvent = (type, message) => {
    if (onLog) onLog(type, message);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    logEvent('click', 'Người dùng nhấp vào nút Thanh Toán trong Giỏ Hàng');
    alert('Cảm ơn bạn! Đây là tính năng Giỏ hàng Demo của bài test tuyển dụng. Hệ thống đã ghi nhận!');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h2>Giỏ hàng của bạn ({cartItems.length})</h2>
          <button className={styles.closeBtn} onClick={() => {
            logEvent('click', 'Đóng Drawer Giỏ Hàng');
            onClose();
          }}>&times;</button>
        </div>

        <div className={styles.body}>
          {cartItems.length === 0 ? (
            <div className={styles.empty}>
              Giỏ hàng trống. Hãy thêm các gói Kibble vào giỏ để tiếp tục!
            </div>
          ) : (
            <div className={styles.itemList}>
              {cartItems.map((item, idx) => (
                <div key={idx} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemTitle}>{item.name}</span>
                    <span className={styles.itemPrice}>{(item.price).toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className={styles.itemActions}>
                    <div className={styles.quantityControls}>
                      <button 
                        onClick={() => {
                          logEvent('click', `Giảm số lượng ${item.name}`);
                          onUpdateQuantity(item.id, item.quantity - 1);
                        }}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => {
                          logEvent('click', `Tăng số lượng ${item.name}`);
                          onUpdateQuantity(item.id, item.quantity + 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => {
                        logEvent('click', `Xóa ${item.name} khỏi Giỏ Hàng`);
                        onRemoveItem(item.id);
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Tổng thanh toán:</span>
              <span className={styles.totalPrice}>{totalPrice.toLocaleString('vi-VN')} đ</span>
            </div>
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Thanh Toán Ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
