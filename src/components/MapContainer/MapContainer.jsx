import React, { useEffect, useRef } from 'react';
import './MapContainer.css';

function MapContainer({                          startPoint,
                          destPoint,
                          outboundPath,
                          inboundPath,
                          currentUserPos,
                          currentUserPov, // Add currentUserPov to props
                          onMapClick,
                          isSettingMode,
                      }) {
    const mapElement = useRef(null);
    const map = useRef(null);
    const startMarker = useRef(null);
    const destMarker = useRef(null);
    const outboundPolyline = useRef(null);
    const inboundPolyline = useRef(null);
    const userMarker = useRef(null); // Ref for the real-time user marker

    useEffect(() => {
        if (!mapElement.current || !window.naver || !window.naver.maps) return;

        const mapOptions = {
            center: new window.naver.maps.LatLng(37.5665, 126.9780),
            zoom: 15,
        };

        map.current = new window.naver.maps.Map(mapElement.current, mapOptions);

        if (isSettingMode && onMapClick) {
            window.naver.maps.Event.addListener(map.current, 'click', (e) => {
                onMapClick(e.coord);
            });
        }

    }, [isSettingMode, onMapClick]);

    // 마커 업데이트
    useEffect(() => {
        if (!map.current) return;
        if (startPoint) {
            if (!startMarker.current) {
                startMarker.current = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(startPoint.y, startPoint.x),
                    map: map.current,
                    icon: {
                        content: `
                            <div style="width: 32px; height: 32px; position: relative;">
                                <svg viewBox="0 0 24 24" width="32" height="32">
                                    <path fill="#28a745" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    <circle cx="12" cy="9.5" r="1.5" fill="white"/>
                                </svg>
                            </div>`,
                        anchor: new window.naver.maps.Point(16, 32),
                    },
                });
            } else {
                startMarker.current.setPosition(new window.naver.maps.LatLng(startPoint.y, startPoint.x));
            }
        }
        if (destPoint) {
            if (!destMarker.current) {
                destMarker.current = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(destPoint.y, destPoint.x),
                    map: map.current,
                    icon: {
                        content: `
                            <div style="width: 32px; height: 32px; position: relative;">
                                <svg viewBox="0 0 24 24" width="32" height="32">
                                    <path fill="#dc3545" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    <circle cx="12" cy="9.5" r="1.5" fill="white"/>
                                </svg>
                            </div>`,
                        anchor: new window.naver.maps.Point(16, 32),
                    },
                });
            } else {
                destMarker.current.setPosition(new window.naver.maps.LatLng(destPoint.y, destPoint.x));
            }
        }
    }, [startPoint, destPoint]);

    // 경로(Polyline) 업데이트
    useEffect(() => {
        if (!map.current) return;

        if (outboundPath && outboundPath.length > 1) {
            if (!outboundPolyline.current) {
                outboundPolyline.current = new window.naver.maps.Polyline({
                    map: map.current,
                    path: outboundPath,
                    strokeColor: '#007bff', // 진한 파란색
                    strokeWeight: 6,
                    strokeOpacity: 0.8,
                });
            } else {
                outboundPolyline.current.setPath(outboundPath);
            }
        }

        if (inboundPath && inboundPath.length > 1) {
            if (!inboundPolyline.current) {
                inboundPolyline.current = new window.naver.maps.Polyline({
                    map: map.current,
                    path: inboundPath,
                    strokeColor: '#6c757d', // 연한 회색
                    strokeWeight: 4,
                    strokeOpacity: 0.7,
                });
            } else {
                inboundPolyline.current.setPath(inboundPath);
            }
        }

    }, [outboundPath, inboundPath]);

    // 실시간 위치 마커 업데이트
    useEffect(() => {
        if (!map.current || !currentUserPos) return;

        const position = new window.naver.maps.LatLng(currentUserPos.y, currentUserPos.x);

        if (!userMarker.current) {
            userMarker.current = new window.naver.maps.Marker({
                position,
                map: map.current,
                icon: {
                    content: '<div class="marker current-user-marker"></div>',
                    anchor: new window.naver.maps.Point(12, 12),
                },
                zIndex: 100, // Ensure the marker is always on top
            });
        } else {
            userMarker.current.setPosition(position);
        }

        // Center the map on the user's current position
        map.current.panTo(position);

    }, [currentUserPos]);

    // 실시간 방향 마커 회전
    useEffect(() => {
        if (!userMarker.current || !currentUserPov) return;

        const markerElement = userMarker.current.getElement();
        if (markerElement) {
            markerElement.style.transform = `rotate(${currentUserPov.pan}deg)`;
        }
    }, [currentUserPov]);


    return <div ref={mapElement} className="map-container" />;
}

export default MapContainer;