import React from 'react';
import styles from '../styles/components.module.css';

const Navbar = ({ tabs, activeTab, onTabChange, disabledTabs = [] }) => (
  <nav className={styles.navbar}>
    {tabs.map(tab => {
      const isDisabled = disabledTabs.includes(tab.key);
      return (
        <button
          key={tab.key}
          className={`${styles.navBtn} ${activeTab === tab.key ? styles.active : ''} ${isDisabled ? styles.disabled : ''}`}
          type="button"
          onClick={() => !isDisabled && onTabChange(tab.key)}
          aria-current={activeTab === tab.key ? 'page' : undefined}
          disabled={isDisabled}
          style={{
            opacity: isDisabled ? 0.5 : 1,
            cursor: isDisabled ? 'not-allowed' : 'pointer'
          }}
        >
          {tab.label}
        </button>
      );
    })}
  </nav>
);

export default Navbar;