import { useState, useEffect } from 'react';

/**
 * Naver Map 인스턴스를 생성하고 관리하는 커스텀 훅
 * @param {React.RefObject<HTMLElement>} mapElementRef - 지도를 렌더링할 DOM 요소의 ref
 * @returns {naver.maps.Map | null} 생성된 Naver Map 인스턴스 (초기에는 null)
 */
const useNaverMap = (mapElementRef) => {
  // 지도 인스턴스를 상태로 관리
  const [map, setMap] = useState(null);

  useEffect(() => {
    const { naver } = window;
    // ref가 없거나 naver API가 로드되지 않았으면 실행하지 않음
    if (!mapElementRef.current || !naver) {
      return;
    }

    // 지도의 기본 옵션 설정
    const mapOptions = {
      center: new naver.maps.LatLng(37.5665, 126.9780), // 기본 위치: 서울 시청
      zoom: 17,
      minZoom: 6,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    };

    // 지도 인스턴스 생성
    const mapInstance = new naver.maps.Map(mapElementRef.current, mapOptions);
    setMap(mapInstance);

    // 컴포넌트가 언마운트될 때 지도 인스턴스를 파괴하여 메모리 누수를 방지
    return () => {
      if (mapInstance) {
        mapInstance.destroy();
      }
    };
  }, [mapElementRef]); // ref 객체가 변경될 때만 useEffect를 다시 실행

  return map;
};

export default useNaverMap;
