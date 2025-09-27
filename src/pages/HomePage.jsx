import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MapContainer from '../components/map/MapContainer';
import SearchControl from '../components/map/SearchControl';
import { geocodeAddress } from '../apis/mapApi.jsx';
import './HomePage.css';

/**
 * 애플리케이션의 메인 페이지 컴포넌트
 * 주소 검색 및 훈련 페이지로의 전환을 담당합니다.
 */
const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * '훈련 시작' 버튼 클릭 시 호출되는 비동기 핸들러
   * 1. 입력된 주소를 좌표로 변환 (Geocoding)
   * 2. 성공 시 TrainingPage로 좌표 정보를 전달하며 이동
   */
  const handleSearch = async ({ start, end }) => {
    if (!start || !end) {
      setError('출발지와 목적지를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Promise.all을 사용하여 출발지와 목적지 좌표를 병렬로, 비동기적으로 조회합니다.
      const [startResult, endResult] = await Promise.all([
        geocodeAddress(start),
        geocodeAddress(end),
      ]);

      // Geocoding 결과에서 필요한 좌표와 주소 정보만 추출합니다.
      const startCoords = {
        lat: parseFloat(startResult.y),
        lng: parseFloat(startResult.x),
        address: startResult.roadAddress || startResult.jibunAddress,
      };
      const endCoords = {
        lat: parseFloat(endResult.y),
        lng: parseFloat(endResult.x),
        address: endResult.roadAddress || endResult.jibunAddress,
      };

      // state와 함께 training 페이지로 이동합니다.
      navigate('/training', {
        state: { start: startCoords, destination: endCoords },
      });

    } catch (err) {
      console.error("Geocoding API 호출 오류:", err);
      setError('주소를 좌표로 변환하는 데 실패했습니다. 정확한 주소를 입력해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="homepage-container">
      <Header />
      <MapContainer />
      <SearchControl onSearch={handleSearch} disabled={isLoading} />
      <Footer />

      {/* 로딩 중이거나 에러 발생 시 사용자에게 피드백을 제공합니다. */}
      {isLoading && <div className="loading-overlay">경로를 검색 중입니다...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default HomePage;
