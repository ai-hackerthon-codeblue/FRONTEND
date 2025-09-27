import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import './SearchControl.css';

/**
 * 출발지/목적지 검색 및 훈련 시작을 위한 UI 컴포넌트
 * @param {object} props
 * @param {function} props.onSearch - '훈련 시작' 버튼 클릭 시 호출될 함수
 * @param {boolean} props.disabled - API 호출 등 로딩 중에 입력을 막기 위한 prop
 */
const SearchControl = ({ onSearch, disabled = false }) => {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');

  const handleSearchClick = () => {
    if (!startPoint || !endPoint) {
      // alert() 대신 나중에 Modal 컴포넌트로 대체 가능
      alert('출발지와 목적지를 모두 입력해주세요.');
      return;
    }
    onSearch({ start: startPoint, end: endPoint });
  };

  return (
    <div className="search-control-wrapper">
      <div className="input-field">
        <Input
          value={startPoint}
          onChange={(e) => setStartPoint(e.target.value)}
          placeholder="출발지 입력"
          disabled={disabled}
        />
      </div>
      <div className="input-field">
        <Input
          value={endPoint}
          onChange={(e) => setEndPoint(e.target.value)}
          placeholder="목적지 입력"
          disabled={disabled}
        />
      </div>
      <Button onClick={handleSearchClick} disabled={disabled}>
        {disabled ? '검색 중...' : '훈련 시작'}
      </Button>
    </div>
  );
};

export default SearchControl;
