import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MapContainer from './components/MapContainer/MapContainer';
import PanoramaView from './components/PanoramaView/PanoramaView';
import ResultsModal from './components/ResultsModal/ResultsModal';

function App() {
    const { trainingId } = useParams();

    useEffect(() => {
        const fetchTrainingData = async () => {
            if (!trainingId) return; // Don't fetch if no ID is present

            try {
                const response = await axios.get(`/api/trainings/${trainingId}`);
                const data = response.data;

                // Convert API data to frontend state format
                const start = { y: data.start_location.lat, x: data.start_location.lon };
                const dest = { y: data.end_location.lat, x: data.end_location.lon };
                const outPath = data.path_to_destination.map(p => new window.naver.maps.LatLng(p[0], p[1]));
                const inPath = data.path_back_to_start.map(p => new window.naver.maps.LatLng(p[0], p[1]));

                // Update state to display the completed training
                setStartPoint(start);
                setDestPoint(dest);
                setOutboundPath(outPath);
                setInboundPath(inPath);
                setCurrentPanoramaPos(start); // Show panorama at the start
                setTrainingResults({
                    startPoint: start,
                    destPoint: dest,
                    outboundPath: outPath,
                    inboundPath: inPath,
                    duration: data.time_taken_seconds * 1000, // Convert to ms
                    analysis: data.analysis_data, // Pass analysis data to results
                });
                setGameState('FINISHED');
                setIsModalOpen(true); // Open the results modal immediately

            } catch (error) {
                console.error('Error fetching training data:', error);
                // Optionally, show an error message to the user
            }
        };

        fetchTrainingData();
    }, [trainingId]); // Empty dependency array ensures this runs only once on mount

    const [gameState, setGameState] = useState('SETTING_START'); // SETTING_START, SETTING_DEST, OUTBOUND, INBOUND, ANALYZING, FINISHED
    const [startPoint, setStartPoint] = useState(null);
    const [destPoint, setDestPoint] = useState(null);
    const [outboundPath, setOutboundPath] = useState([]);
    const [inboundPath, setInboundPath] = useState([]);
    const [currentPanoramaPos, setCurrentPanoramaPos] = useState(null);
    const [currentUserPos, setCurrentUserPos] = useState(null);
    const [currentUserPov, setCurrentUserPov] = useState({ pan: 0 });

    const [startTime, setStartTime] = useState(0);
    const [trainingResults, setTrainingResults] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const lastUpdateTime = useRef(0); // For throttling location updates
    const lastPovUpdateTime = useRef(0); // For throttling POV updates
    const [userId, setUserId] = useState('test_user_01'); // Added userId state

    const getInstruction = () => {
        switch (gameState) {
            case 'SETTING_START':
                return '출발지를 지도에서 클릭하여 설정해주세요.';
            case 'SETTING_DEST':
                return '목적지를 지도에서 클릭하여 설정해주세요.';
            case 'OUTBOUND':
                return '로드뷰를 이용해 목적지로 이동하세요. (화면의 화살표 클릭)';
            case 'INBOUND':
                return '로드뷰를 이용해 다시 출발지로 돌아오세요.';
            case 'ANALYZING':
                return '훈련 결과를 분석 중입니다. 잠시만 기다려주세요...';
            case 'FINISHED':
                return '훈련이 완료되었습니다! 결과를 확인하세요.';
            default:
                return '';
        }
    };

    const handleMapClick = useCallback((coord) => {
        if (gameState === 'SETTING_START') {
            setStartPoint(coord);
            setGameState('SETTING_DEST');
        } else if (gameState === 'SETTING_DEST') {
            setDestPoint(coord);
        }
    }, [gameState]);

    const startTraining = () => {
        if (startPoint && destPoint) {
            setOutboundPath([new window.naver.maps.LatLng(startPoint.y, startPoint.x)]);
            setCurrentPanoramaPos(startPoint);
            setGameState('OUTBOUND');
            setStartTime(Date.now());
        } else {
            alert('출발지와 목적지를 모두 설정해야 합니다.');
        }
    };

    const handleLocationChange = useCallback((newCoord) => {
        const now = Date.now();
        if (now - lastUpdateTime.current < 200) { // Throttle to 200ms
            return;
        }
        lastUpdateTime.current = now;

        setCurrentUserPos(newCoord); // Update current user position in real-time

        const isDuplicate = (path, coord) => {
            if (path.length === 0) return false;
            const lastPos = path[path.length - 1];
            return lastPos.equals(coord);
        };

        if (gameState === 'OUTBOUND') {
            setOutboundPath(prevPath => {
                if (!isDuplicate(prevPath, newCoord)) {
                    return [...prevPath, newCoord];
                }
                return prevPath;
            });
        } else if (gameState === 'INBOUND') {
            setInboundPath(prevPath => {
                if (!isDuplicate(prevPath, newCoord)) {
                    return [...prevPath, newCoord];
                }
                return prevPath;
            });
        }
    }, [gameState]);

    const handlePovChange = useCallback((pov) => {
        const now = Date.now();
        if (now - lastPovUpdateTime.current < 100) { // Throttle to 100ms
            return;
        }
        lastPovUpdateTime.current = now;
        setCurrentUserPov(pov);
    }, []);

    const completeLeg = async () => {
        if (gameState === 'OUTBOUND') {
            setInboundPath([new window.naver.maps.LatLng(destPoint.y, destPoint.x)]);
            setCurrentPanoramaPos(destPoint);
            setGameState('INBOUND');
        } else if (gameState === 'INBOUND') {
            setGameState('ANALYZING');
            const endTime = Date.now();
            const durationInSeconds = (endTime - startTime) / 1000;

            // Convert LatLng objects to simple arrays for the backend
            const formatPathForAPI = (path) => path.map(p => [p.lat(), p.lng()]);

            const trainingData = {
                user_id: userId, // Added user_id
                start_location: { lat: startPoint.y, lon: startPoint.x },
                end_location: { lat: destPoint.y, lon: destPoint.x },
                path_to_destination: formatPathForAPI(outboundPath),
                path_back_to_start: formatPathForAPI(inboundPath),
                time_taken_seconds: durationInSeconds,
            };

            console.log('Sending training data:', trainingData); // Log data before sending

            try {
                const response = await axios.post('/api/trainings', trainingData);
                const { id, analysis_data } = response.data;

                // Update URL to reflect the new training ID without reloading the page
                window.history.pushState({}, '', `/trainings/${id}`);

                setTrainingResults({
                    startPoint,
                    destPoint,
                    outboundPath,
                    inboundPath,
                    duration: durationInSeconds * 1000,
                    analysis: analysis_data,
                });
                setGameState('FINISHED');
                setIsModalOpen(true);
            } catch (error) {
                console.error("Error submitting training for analysis:", error);
                // Handle error: show a message and revert state
                alert("결과 분석에 실패했습니다. 다시 시도해주세요.");
                setGameState('INBOUND'); // Or reset completely
            }
        }
    };

    const resetTraining = () => {
        window.history.pushState({}, '', '/'); // Reset URL to root
        setGameState('SETTING_START');
        setStartPoint(null);
        setDestPoint(null);
        setOutboundPath([]);
        setInboundPath([]);
        setCurrentPanoramaPos(null);
        setCurrentUserPos(null); // Reset current user position
        setCurrentUserPov({ pan: 0 }); // Reset POV
        setTrainingResults(null);
        setIsModalOpen(false);
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>길 찾기 훈련</h1>
                <p className="instruction-text">{getInstruction()}</p>
            </header>
            <main className="main-content">
                <div className="view-container panorama-section">
                    {currentPanoramaPos ? (
                        <PanoramaView
                            position={currentPanoramaPos}
                            onLocationChange={handleLocationChange}
                            onPovChange={handlePovChange}
                        />
                    ) : (
                        <div className="placeholder">훈련을 시작하면 여기에 로드뷰가 표시됩니다.</div>
                    )}
                </div>
                <div className="view-container map-section">
                    <MapContainer
                        startPoint={startPoint}
                        destPoint={destPoint}
                        outboundPath={outboundPath}
                        inboundPath={inboundPath}
                        currentUserPos={currentUserPos} // Pass current position
                        currentUserPov={currentUserPov} // Pass current POV
                        onMapClick={handleMapClick}
                        isSettingMode={gameState === 'SETTING_START' || gameState === 'SETTING_DEST'}
                    />
                </div>
            </main>
            <footer className="app-footer">
                { (gameState === 'SETTING_START' || gameState === 'SETTING_DEST') && (
                    <button onClick={startTraining} disabled={!startPoint || !destPoint}>훈련 시작</button>
                )}
                { gameState === 'OUTBOUND' && (
                    <button onClick={completeLeg}>목적지 도착</button>
                )}
                { gameState === 'INBOUND' && (
                    <button onClick={completeLeg}>출발지 복귀 (훈련 종료)</button>
                )}
            </footer>

            <ResultsModal
                isOpen={isModalOpen}
                onClose={resetTraining}
                results={trainingResults}
            />
        </div>
    );
}

export default App;