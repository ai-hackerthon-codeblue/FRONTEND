// src/MapContainer.jsx

import React, { useEffect, useRef, useMemo } from 'react';

function MapContainer() {
// 1. 지도를 담을 DOM 요소를 참조하기 위해 useRef 사용
const mapElement = useRef(null);

// 2. 생성된 지도 인스턴스를 저장하여 재사용하기 위해 useRef 사용
const mapInstance = useRef(null);

// 3. Polyline을 그릴 좌표 배열을 useMemo로 감싸 불필요한 재생성을 방지
const polylinePath = useMemo(() => ([
{ lat: 37.566826, lng: 126.9786567 }, // 서울 시청
{ lat: 37.579617, lng: 126.977041 },  // 경복궁
{ lat: 37.5839,   lng: 126.9803 },    // 창덕궁
{ lat: 37.5702,   lng: 126.9921 },    // 종묘
{ lat: 37.5662,   lng: 126.9936 }     // 세운상가
]), []);

// 4. 컴포넌트가 렌더링된 후 지도를 초기화하는 useEffect
useEffect(() => {
// window 객체에서 naver maps API를 확인 (스크립트 로딩 확인)
const { naver } = window;
if (!naver || !naver.maps) {
     console.error("Naver Maps 스크립트가 로드되지 않았습니다.");
     return;
}

// 지도를 렌더링할 DOM 요소가 있는지 확인
if (!mapElement.current) return;

// 지도 옵션 설정
const mapOptions = {
     center: new naver.maps.LatLng(37.5700, 126.9850),
     zoom: 14,
};

// 지도 인스턴스 생성 (최초 한 번만 생성하여 mapInstance에 저장)
if (!mapInstance.current) {
     mapInstance.current = new naver.maps.Map(mapElement.current, mapOptions);
}
const map = mapInstance.current;

// Polyline 좌표를 naver.maps.LatLng 객체 배열로 변환
const path = polylinePath.map(coord => new naver.maps.LatLng(coord.lat, coord.lng));

// Polyline 생성 및 지도에 추가
new naver.maps.Polyline({
     map: map,
     path: path,
     strokeColor: '#E51D1A',
     strokeOpacity: 1,
     strokeWeight: 4,
     strokeLineCap: 'round',
});

// (선택사항) 모든 좌표가 화면에 보이도록 지도의 경계 자동 조절
if (path.length > 0) {
     const bounds = new naver.maps.LatLngBounds(path[0], path[0]);
     path.forEach(latlng => bounds.extend(latlng));
     map.fitBounds(bounds);
}

}, [polylinePath]); // polylinePath가 변경될 때만 effect 재실행

// 5. 지도를 표시할 div 요소 반환
return (
<div ref={mapElement} style={{ width: '100%', height: '600px' }} />
);
}

export default MapContainer;