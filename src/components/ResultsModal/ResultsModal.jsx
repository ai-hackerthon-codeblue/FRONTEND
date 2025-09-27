import React from 'react';
import MapContainer from '../MapContainer/MapContainer';
import './ResultsModal.css';

function ResultsModal({ isOpen, onClose, results }) {
    if (!isOpen) return null;

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}분 ${seconds}초`;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>훈련 결과</h2>
                <p>
                    <strong>소요 시간:</strong> {formatTime(results.duration)}
                </p>
                <div className="modal-map-area">
                    <MapContainer
                        startPoint={results.startPoint}
                        destPoint={results.destPoint}
                        outboundPath={results.outboundPath}
                        inboundPath={results.inboundPath}
                        isSettingMode={false}
                    />
                </div>
                <button onClick={onClose} className="modal-close-btn">
                    다시하기
                </button>
            </div>
        </div>
    );
}

export default ResultsModal;