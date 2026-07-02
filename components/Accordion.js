'use client';
import { useState } from 'react';
import styles from './Accordion.module.css';

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className={`${styles.item} ${isOpen ? styles.open : ''}`}>
            <button className={styles.trigger} onClick={() => toggleItem(index)}>
              <span className={styles.question}>{item.question}</span>
              <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
            </button>
            <div className={styles.contentWrapper} style={{ height: isOpen ? 'auto' : 0 }}>
              <div className={styles.content}>
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
