import React from 'react';
import './Input.css';

/**
 * 공통 입력창 컴포넌트
 * @param {object} props
 * @param {string} props.value - 입력창의 현재 값
 * @param {function} props.onChange - 값이 변경될 때 실행될 함수
 * @param {string} props.placeholder - 입력창에 표시될 안내 텍스트
 * @param {string} [props.type] - input 타입 (기본값 'text')
 */
const Input = ({ value, onChange, placeholder, type = 'text' }) => {
  return (
    <input
      className="common-input"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default Input;