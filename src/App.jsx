import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapContainer from './components/MapContainer/MapContainer';
import PanoramaView from './components/PanoramaView/PanoramaView';
import ResultsModal from './components/ResultsModal/ResultsModal';

function App() {
    useEffect(() => {
        const fetchTrainingData = async () => {
            try {
                const trainingId = '-Nq_xyz'; // A hardcoded ID for now
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
    }, []); // Empty dependency array ensures this runs only once on mount

    const [gameState, setGameState] = useState('SETTING_START'); // SETTING_START, SETTING_DEST, OUTBOUND, INBOUND, FINISHED
    const [startPoint, setStartPoint] = useState(null);
    const [destPoint, setDestPoint] = useState(null);
    const [outboundPath, setOutboundPath] = useState([]);
    const [inboundPath, setInboundPath] = useState([]);
    const [currentPanoramaPos, setCurrentPanoramaPos] = useState(null);

    const [startTime, setStartTime] = useState(0);
    const [trainingResults, setTrainingResults] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            case 'FINISHED':
                return '훈련이 완료되었습니다! 결과를 확인하세요.';
            default:
                return '';
        }
    };

    const handleMapClick = (coord) => {
        if (gameState === 'SETTING_START') {
            setStartPoint(coord);
            setGameState('SETTING_DEST');
        } else if (gameState === 'SETTING_DEST') {
            setDestPoint(coord);
        }
    };

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

    const handleLocationChange = (newCoord) => {
        // Naver 로드뷰 API는 때때로 동일한 위치 이벤트를 여러 번 발생시키므로 중복을 방지합니다.
        const isDuplicate = (path, coord) => {
            if (path.length === 0) return false;
            const lastPos = path[path.length - 1];
            return lastPos.equals(coord);
        };

        if (gameState === 'OUTBOUND') {
            if(!isDuplicate(outboundPath, newCoord)) {
                setOutboundPath(prev => [...prev, newCoord]);
            }
        } else if (gameState === 'INBOUND') {
            if(!isDuplicate(inboundPath, newCoord)) {
                setInboundPath(prev => [...prev, newCoord]);
            }
        }
    };

    const completeLeg = () => {
        if (gameState === 'OUTBOUND') {
            setInboundPath([new window.naver.maps.LatLng(destPoint.y, destPoint.x)]);
            setCurrentPanoramaPos(destPoint);
            setGameState('INBOUND');
        } else if (gameState === 'INBOUND') {
            const endTime = Date.now();
            setTrainingResults({
                startPoint,
                destPoint,
                outboundPath,
                inboundPath,
                duration: endTime - startTime,
            });
            setGameState('FINISHED');
            setIsModalOpen(true);
        }
    };

    const resetTraining = () => {
        setGameState('SETTING_START');
        setStartPoint(null);
        setDestPoint(null);
        setOutboundPath([]);
        setInboundPath([]);
        setCurrentPanoramaPos(null);
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