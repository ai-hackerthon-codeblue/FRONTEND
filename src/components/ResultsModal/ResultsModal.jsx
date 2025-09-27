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
                    <strong>소요 시간:</strong> {results ? formatTime(results.duration) : 'N/A'}
                </p>
                {results && results.analysis && (
                    <div className="analysis-section">
                        <h3>훈련 분석</h3>
                        <p><strong>분석 요약:</strong> {results.analysis.analysis_summary}</p>
                        <p>
                            <strong>복귀 경로 일치율: </strong>
                            {(100 - results.analysis.error_rate).toFixed(2)}%
                        </p>
                    </div>
                )}
                <div className="modal-map-area">
                    <MapContainer
                        startPoint={results.startPoint}
                        destPoint={results.destPoint}
                        outboundPath={results.outboundPath}
                        inboundPath={results.inboundPath}
                        isSettingMode={false}
                        isResultsView={true} // Indicate that this is for results display
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