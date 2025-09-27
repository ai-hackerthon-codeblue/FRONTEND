import React from 'react';
import './Header.css';

/**
 * 애플리케이션의 공통 상단 헤더 컴포넌트
 * 앱의 제목을 표시합니다.
 */
const Header = () => {
  return (
    <header className="app-header">
      <h1 className="app-title">경로당</h1>
    </header>
  );
};

export default Header;
