import React, { useEffect, useRef } from 'react';
import './MapContainer.css';

/**
 * Naver Map을 렌더링하는 메인 컨테이너 컴포넌트
 * 이 컴포넌트는 지도가 표시될 DOM 요소를 생성하고 초기화합니다.
 * @param {object} props
 * @param {React.Ref} props.mapRef - 부모 컴포넌트에서 지도 인스턴스를 참조하기 위한 ref
 */
const MapContainer = ({ mapRef }) => {
  const mapElement = useRef(null);

  useEffect(() => {
    const { naver } = window;
    if (!mapElement.current || !naver) return;

    // 서울 시청을 기본 위치로 설정
    const location = new naver.maps.LatLng(37.5665, 126.9780);
    const mapOptions = {
      center: location,
      zoom: 17,
      minZoom: 6,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    };

    // 지도 인스턴스 생성 및 부모로 전달된 ref에 할당
    const map = new naver.maps.Map(mapElement.current, mapOptions);
    if (mapRef) {
      mapRef.current = map;
    }

    // 컴포넌트 언마운트 시 지도 인스턴스 파괴
    return () => {
      map.destroy();
    };
  }, [mapRef]);

  return <div ref={mapElement} className="map-container" />;
};

export default MapContainer;
