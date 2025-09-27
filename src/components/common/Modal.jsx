import React from 'react';
import './Modal.css';

/**
 * 공통 모달 컴포넌트
 * @param {object} props
 * @param {boolean} props.isOpen - 모달의 열림/닫힘 상태
 * @param {function} props.onClose - 모달을 닫는 함수
 * @param {React.ReactNode} props.children - 모달 내부에 표시될 콘텐츠
 */
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        {/* 닫기 버튼을 자식 컨텐츠에 포함시키거나 여기에 고정으로 추가할 수 있습니다. */}
        {/* <button className="modal-close-button" onClick={onClose}>닫기</button> */}
      </div>
    </div>
  );
};

export default Modal;