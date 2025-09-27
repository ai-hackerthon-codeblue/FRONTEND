import React, { useEffect, useRef } from 'react';
import './PanoramaView.css';

function PanoramaView({ position, onLocationChange, onPovChange, isNaverMapsLoaded }) {
    const panoramaElement = useRef(null);
    const panorama = useRef(null);

    useEffect(() => {
        if (!panoramaElement.current || !position || !window.naver || !window.naver.maps || !isNaverMapsLoaded) return;

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

        const locationListener = window.naver.maps.Event.addListener(panorama.current, 'pano_changed', () => {
            onLocationChange(panorama.current.getPosition());
        });

        const povListener = window.naver.maps.Event.addListener(panorama.current, 'pov_changed', (pov) => {
            onPovChange(pov);
        });

        // Add a click event listener to investigate click-to-move functionality
        const clickListener = window.naver.maps.Event.addListener(panorama.current, 'click', (e) => {
            console.log('Panorama clicked:', e);
            // 'e' should contain information about the click, such as coordinates or direction
            // We will analyze this output to determine how to implement click-to-move
        });

        return () => {
            window.naver.maps.Event.removeListener(locationListener);
            window.naver.maps.Event.removeListener(povListener);
            window.naver.maps.Event.removeListener(clickListener); // Clean up the new listener
        }

    }, [position, onLocationChange, onPovChange, isNaverMapsLoaded]);

    return <div ref={panoramaElement} className="panorama-container" />;
}

export default PanoramaView;