import React from 'react';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import './ResultPage.css';

/**
 * 훈련 결과 분석 페이지 컴포넌트
 * @param {object} props
 * @param {boolean} props.isOpen - 결과 페이지(모달) 표시 여부
 * @param {function} props.onClose - 닫기 버튼 클릭 시 호출될 함수
 * @param {object} props.resultData - 표시할 결과 데이터
 */
const ResultPage = ({ isOpen, onClose, resultData }) => {
  // resultData가 없으면 기본값 사용
  const data = resultData || {
    time: '0분 0초',
    analysis: '분석 결과가 여기에 표시됩니다. 경로 유사도, 주요 이탈 지점 등을 텍스트로 제공합니다.',
    accuracy: '0.00%',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="result-container">
        <h2 className="result-title">훈련 결과</h2>
        <div className="result-section">
          <h3 className="section-title">소요 시간</h3>
          <p className="section-content">{data.time}</p>
        </div>
        <div className="result-section">
          <h3 className="section-title">훈련 분석</h3>
          <p className="section-content analysis-text">{data.analysis}</p>
        </div>
        <div className="result-section">
          <h3 className="section-title">복귀 경로 오차율</h3>
          <p className="section-content accuracy-text">{data.accuracy}</p>
        </div>
        <div className="result-actions">
          <Button onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ResultPage;
