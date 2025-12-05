import React from 'react';
import styles from '../styles/components.module.css';

const Layout = ({ 
  children, 
  sidebar = null, 
  navbar = null, 
  title = null,
  className = '',
  containerClassName = ''
}) => {
  return (
    <div className={styles.layoutOuter}>
      <div className={`${styles.layoutContainer} ${containerClassName}`}>
        {sidebar && (
          <aside className={styles.layoutSidebar}>
            {sidebar}
          </aside>
        )}
        <main className={`${styles.layoutMain} ${className}`}>
          {title && (
            <div className={styles.layoutTitle}>
              <h2>{title}</h2>
            </div>
          )}
          {navbar && (
            <div className={styles.layoutNavbar}>
              {navbar}
            </div>
          )}
          <div className={styles.layoutContent}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;