import React, { useEffect, useRef } from 'react';
import './MapContainer.css';

function MapContainer({
                          startPoint,
                          destPoint,
                          outboundPath,
                          inboundPath,
                          currentUserPos,
                          currentUserPov,
                          onMapClick,
                          isSettingMode,
                          onArrivalAlarmTriggered, // New prop
                          gameState, // Add gameState to props
                          onReturnToStartDetected, // New prop
                          isResultsView, // New prop to indicate if it's a results view
                      }) {
    const mapElement = useRef(null);
    const map = useRef(null);
    const startMarker = useRef(null);
    const destMarker = useRef(null);
    const outboundPolyline = useRef(null);
    const inboundPolyline = useRef(null);
    const userMarker = useRef(null);
    const hasArrived = useRef(false);
  const hasReturnedToOrigin = useRef(false);

    // 도착 알림음을 위한 audio 객체 참조
    const arrivalAudio = useRef(null);

    // 컴포넌트 마운트 시 오디오 객체 생성 및 알림 권한 요청
    useEffect(() => {
        arrivalAudio.current = new Audio('/sounds/arrival.mp3'); // mp3 파일은 public/sounds 폴더에 위치해야 합니다.

        // 알림 권한 요청
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    // 지도 초기화
    useEffect(() => {
        if (!mapElement.current || !window.naver || !window.naver.maps) return;

        const initialCenter = startPoint
            ? new window.naver.maps.LatLng(startPoint.y, startPoint.x)
            : new window.naver.maps.LatLng(37.5665, 126.9780);

        const mapOptions = {
            center: initialCenter,
            zoom: 15,
        };

        map.current = new window.naver.maps.Map(mapElement.current, mapOptions);

        if (isSettingMode && onMapClick) {
            window.naver.maps.Event.addListener(map.current, 'click', (e) => {
                onMapClick(e.coord);
            });
        }

    }, [isSettingMode, onMapClick, startPoint]);

    // 시작/도착 마커 업데이트
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

    // 목적지 변경 시 도착 상태 초기화
    useEffect(() => {
        if (destPoint) {
            hasArrived.current = false;
            if (onArrivalAlarmTriggered) {
                onArrivalAlarmTriggered(false);
            }
        }
    }, [destPoint]);

    // 경로(Polyline) 업데이트
    useEffect(() => {
        if (!map.current) return;

        console.log('MapContainer Polyline useEffect running.');
        console.log('outboundPath:', outboundPath);
        console.log('inboundPath:', inboundPath);

        let bounds = new window.naver.maps.LatLngBounds();
        let hasPaths = false;

        // Outbound Path (가는 길)
        if (outboundPath && outboundPath.length > 1) {
            console.log('Rendering outboundPath. Length:', outboundPath.length);
            if (!outboundPolyline.current) {
                outboundPolyline.current = new window.naver.maps.Polyline({
                    map: map.current,
                    path: outboundPath,
                    strokeColor: '#007bff',
                    strokeWeight: 6,
                    strokeOpacity: 0.8,
                });
            } else {
                outboundPolyline.current.setPath(outboundPath);
            }
            outboundPath.forEach(p => bounds.extend(p));
            hasPaths = true;
        } else {
            console.log('outboundPath is not valid or too short to render.');
        }

        // Inbound Path (오는 길)
        if (inboundPath && inboundPath.length > 1) {
            console.log('Rendering inboundPath. Length:', inboundPath.length);
            if (!inboundPolyline.current) {
                inboundPolyline.current = new window.naver.maps.Polyline({
                    map: map.current,
                    path: inboundPath,
                    strokeColor: '#dc3545', // Red color for inbound path
                    strokeWeight: 4,
                    strokeOpacity: 0.7,
                });
            } else {
                inboundPolyline.current.setPath(inboundPath);
            }
            inboundPath.forEach(p => bounds.extend(p));
            hasPaths = true;
        } else {
            console.log('inboundPath is not valid or too short to render.');
        }

        // Fit map bounds to polylines if paths exist
        if (hasPaths) {
            map.current.fitBounds(bounds);
            console.log('Map bounds fitted to paths.');
        } else {
            console.log('No paths to fit bounds to.');
        }

    }, [outboundPath, inboundPath]);

    // 실시간 위치 마커 업데이트 및 도착 감지 (useEffect 통합 및 수정)
    useEffect(() => {
        console.log('MapContainer useEffect: currentUserPos changed', currentUserPos);
        if (!map.current || !currentUserPos) return;

        const position = new window.naver.maps.LatLng(currentUserPos.y, currentUserPos.x); // Define position here

        if (!isResultsView) { // Only update user position and pan map if not in results view
            // 사용자 마커 위치 업데이트
            if (!userMarker.current) {
                userMarker.current = new window.naver.maps.Marker({
                    position,
                    map: map.current,
                    icon: {
                        content: '<div class="marker current-user-marker"></div>',
                        anchor: new window.naver.maps.Point(12, 12),
                    },
                    zIndex: 100,
                });
            } else {
                userMarker.current.setPosition(position);
            }

            // 지도를 사용자 현재 위치로 이동
            map.current.panTo(position);
        }

        // 목적지가 설정된 경우에만 도착 감지 로직 실행
        if (destPoint) {
            const destPosition = new window.naver.maps.LatLng(destPoint.y, destPoint.x);

            // [수정된 부분] getProjection().getDistance()를 사용하여 거리 계산
            const distance = map.current.getProjection().getDistance(position, destPosition);
            console.log('Distance to destination:', distance, 'm');

            // 거리가 10m 이하이고, 아직 도착 알림이 울리지 않았다면
            if (distance <= 10 && !hasArrived.current) {
                console.log("목적지 10m 이내 도착! Alarm triggered.");

                if (arrivalAudio.current) {
                    arrivalAudio.current.play();
                }

                if (navigator.vibrate) {
                    navigator.vibrate(200);
                }

                // 브라우저 알림 표시
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('도착 알림', {
                        body: '목적지에 10m 이내로 도착했습니다!',
                    });
                }

                hasArrived.current = true;
                if (onArrivalAlarmTriggered) {
                    onArrivalAlarmTriggered(true);
                }
            }
        }

        // 출발지로 복귀 감지 (INBOUND 상태일 때만)
        if (gameState === 'INBOUND' && startPoint) {
            const startPosition = new window.naver.maps.LatLng(startPoint.y, startPoint.x);
            const distanceToStart = map.current.getProjection().getDistance(position, startPosition);
            console.log('Distance to start point:', distanceToStart, 'm', 'gameState:', gameState);

            if (distanceToStart <= 10 && !hasReturnedToOrigin.current) {
                console.log("출발지 10m 이내 도착! Alarm triggered.");
                if (arrivalAudio.current) {
                    arrivalAudio.current.play();
                }
                if (navigator.vibrate) {
                    navigator.vibrate(200);
                }
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('훈련 종료 알림', {
                        body: '출발지에 10m 이내로 도착하여 훈련이 종료됩니다!',
                    });
                }
                hasReturnedToOrigin.current = true;
                if (onReturnToStartDetected) {
                    onReturnToStartDetected(); // Call the callback to App.jsx
                }
            }
        }

    }, [currentUserPos, destPoint, startPoint, gameState, onArrivalAlarmTriggered, onReturnToStartDetected]);

    // 실시간 방향 마커 회전
    useEffect(() => {
        if (!userMarker.current || !currentUserPov) return;

        const markerElement = userMarker.current.getElement();
        if (markerElement) {
            // CSS transform을 이용하여 부드러운 회전 효과를 줄 수 있습니다.
            markerElement.style.transition = 'transform 0.2s linear';
            markerElement.style.transform = `rotate(${currentUserPov.pan}deg)`;
        }
    }, [currentUserPov]);


    return <div ref={mapElement} className="map-container" />;
}

export default MapContainer;