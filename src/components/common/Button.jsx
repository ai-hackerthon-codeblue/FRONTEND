import React from 'react';
import './Button.css';

/**
 * 공통 버튼 컴포넌트
 * @param {object} props
 * @param {function} props.onClick - 버튼 클릭 시 실행될 함수
 * @param {string} props.children - 버튼 내부에 표시될 텍스트
 * @param {string} [props.className] - 추가적인 스타일링을 위한 CSS 클래스 (e.g., 'primary', 'secondary')
 * @param {boolean} [props.disabled] - 버튼 비활성화 여부
 */
const Button = ({ onClick, children, className = 'primary', disabled = false }) => {
  return (
    <button
      className={`common-button ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;