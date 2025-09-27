import React, { useEffect, useRef } from 'react';
import './PanoramaView.css';

function PanoramaView({ position, onLocationChange }) {
    const panoramaElement = useRef(null);
    const panorama = useRef(null);

    useEffect(() => {
        if (!panoramaElement.current || !position || !window.naver || !window.naver.maps) return;

        const panoramaOptions = {
            position: new window.naver.maps.LatLng(position.y, position.x),
            pov: {
                pan: 0,
                tilt: 0,
                zoom: 0,
            },
            aroundControl: true,
            aroundControlOptions: {
                position: window.naver.maps.Position.TOP_RIGHT,
            },
        };

        panorama.current = new window.naver.maps.Panorama(panoramaElement.current, panoramaOptions);

        const handleClick = (e) => {
            const newCoord = panorama.current.getPosition();
            onLocationChange(newCoord);
        };

        // 로드뷰의 화살표를 클릭(위치 변경)할 때마다 이벤트 발생
        const listener = window.naver.maps.Event.addListener(panorama.current, 'position_changed', handleClick);

        return () => {
            // 컴포넌트 언마운트 시 이벤트 리스너 제거
            window.naver.maps.Event.removeListener(listener);
        }

    }, [position, onLocationChange]);

    return <div ref={panoramaElement} className="panorama-container" />;
}

export default PanoramaView;