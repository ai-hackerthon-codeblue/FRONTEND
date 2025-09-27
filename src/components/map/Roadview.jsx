import React, { useEffect, useRef } from 'react';
import './Roadview.css';

/**
 * Naver Map 로드뷰(파노라마)를 표시하는 컴포넌트
 * @param {object} props
 * @param {boolean} props.visible - 로드뷰 표시 여부
 * @param {object} props.startPosition - 로드뷰를 시작할 위경도 객체 (naver.maps.LatLng)
 * @param {function} props.onClose - 닫기 버튼 클릭 시 호출될 함수
 * @param {function} props.onPositionChanged - 로드뷰 내 위치가 변경될 때 호출될 함수
 */
const Roadview = ({ visible, startPosition, onClose, onPositionChanged }) => {
  const panoRef = useRef(null);

  useEffect(() => {
    if (!visible || !panoRef.current || !startPosition) return;

    const { naver } = window;
    if (!naver) return;

    const pano = new naver.maps.Panorama(panoRef.current, {
      position: startPosition,
      visible: true,
      aroundControl: true, // 주변 둘러보기 컨트롤
      flightSpotControl: true, // 항공뷰 스팟 컨트롤
    });

    const listener = naver.maps.Event.addListener(pano, 'position_changed', (latlng) => {
      if (onPositionChanged) {
        onPositionChanged({ lat: latlng.y, lng: latlng.x });
      }
    });

    return () => {
      naver.maps.Event.removeListener(listener);
      // Panorama 인스턴스 자체를 파괴하는 API는 공식적으로 제공되지 않으므로,
      // DOM 요소를 비우는 것으로 정리합니다.
      if (panoRef.current) {
        panoRef.current.innerHTML = '';
      }
    };
  }, [visible, startPosition, onPositionChanged]);

  if (!visible) {
    return null;
  }

  return (
    <div className="roadview-wrapper">
      <div ref={panoRef} className="roadview-pano"></div>
      <button className="roadview-close" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Roadview;
