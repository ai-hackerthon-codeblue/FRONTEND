import React, { useEffect, useRef } from 'react';
import './MapContainer.css';

function MapContainer({
                          startPoint,
                          destPoint,
                          outboundPath,
                          inboundPath,
                          onMapClick,
                          isSettingMode,
                      }) {
    const mapElement = useRef(null);
    const map = useRef(null);
    const startMarker = useRef(null);
    const destMarker = useRef(null);
    const outboundPolyline = useRef(null);
    const inboundPolyline = useRef(null);

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
                        content: '<div class="marker start-marker">출발</div>',
                        anchor: new window.naver.maps.Point(20, 20),
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
                        content: '<div class="marker dest-marker">목적</div>',
                        anchor: new window.naver.maps.Point(20, 20),
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


    return <div ref={mapElement} className="map-container" />;
}

export default MapContainer;