import React from 'react';
import './Footer.css';

/**
 * 애플리케이션의 공통 하단 푸터 컴포넌트
 * 저작권 정보를 표시합니다.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <p>&copy; {currentYear} CodeBlue. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
