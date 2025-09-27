import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Roadview from '../components/map/Roadview';
import { getNearestPanorama, sendPathData } from '../apis/mapApi';
import './TrainingPage.css';

/**
 * 로드뷰를 통해 경로 훈련을 진행하는 페이지
 */
const TrainingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // HomePage에서 전달받은 출발지 및 목적지 좌표
  const { start, destination } = location.state || {};

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPath, setUserPath] = useState([]);
  
  const [panoramaStartPosition, setPanoramaStartPosition] = useState(null);
  // [추가] 목적지에서 가장 가까운 로드뷰 위치(실제 도착 목표 지점)를 저장할 상태
  const [targetPosition, setTargetPosition] = useState(null);

  useEffect(() => {
    // 전달된 state가 없으면 홈페이지로 리디렉션
    if (!start || !destination) {
      alert("출발지 또는 목적지 정보가 없습니다. 메인 페이지로 돌아갑니다.");
      navigate('/');
      return;
    }

    const findAndSetPositions = async () => {
      try {
        const startLatLng = new window.naver.maps.LatLng(start.lat, start.lng);
        const destinationLatLng = new window.naver.maps.LatLng(destination.lat, destination.lng);
        
        // [수정] 출발지와 목적지 근처의 가장 가까운 로드뷰 위치를 동시에 찾습니다.
        const [startPanorama, destPanorama] = await Promise.all([
          getNearestPanorama(startLatLng),
          getNearestPanorama(destinationLatLng)
        ]);
        
        // 찾은 로드뷰 위치들을 상태에 저장
        setPanoramaStartPosition(startPanorama.position);
        setTargetPosition(destPanorama.position); // 실제 도착 목표 지점 설정
        
        // 첫 위치를 사용자 경로에 기록
        setUserPath([{ lat: startPanorama.position.y, lng: startPanorama.position.x }]);

      } catch (err) {
        console.error("로드뷰 위치 탐색 오류:", err);
        setError("출발지 또는 목적지 근처에서 로드뷰를 찾을 수 없습니다. 다른 주소를 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };

    findAndSetPositions();

  }, [start, destination, navigate]);


  // 로드뷰 내에서 위치가 변경될 때마다 호출되는 함수
  const handlePositionChange = (latlng) => {
    const newPosition = { lat: latlng.y, lng: latlng.x };
    setUserPath(prevPath => [...prevPath, newPosition]);
    checkIfArrived(latlng);
  };

  // 목적지 도착 여부 확인 함수
  const checkIfArrived = (currentLatLng) => {
    // [수정] 목표 지점이 설정되었는지 확인
    if (!targetPosition) return;

    // [수정] 현재 위치와 '실제 목표 지점(가장 가까운 로드뷰)' 사이의 거리를 계산
    const distance = currentLatLng.distanceTo(targetPosition);

    // [수정] 거리가 1미터 이하일 경우 도착으로 판정 (좌표가 거의 같음)
    if (distance <= 1) { 
      alert("목적지에 도착했습니다! 훈련 결과를 전송합니다.");
      sendPathData(userPath, start, destination)
        .then(result => {
          console.log("서버 응답:", result);
          // TODO: 결과 페이지로 이동하며 결과 데이터 전달
          navigate('/result', { state: { resultData: result, path: userPath } });
        })
        .catch(err => {
          console.error("결과 전송 실패:", err);
          alert("결과 전송에 실패했습니다.");
        });
    }
  };

  if (isLoading) {
    // [수정] 로딩 메시지를 더 명확하게 변경하여 사용자에게 현재 상황을 알려줍니다.
    return <div className="training-status">출발지에서 가장 가까운 도로를 찾고 있습니다...</div>;
  }

  if (error) {
    return <div className="training-status error">{error}</div>;
  }

  return (
    <div className="training-container">
      {panoramaStartPosition && (
        <Roadview
          visible={true}
          position={panoramaStartPosition}
          onPositionChange={handlePositionChange}
          onClose={() => navigate('/')} // 닫기 버튼 클릭 시 홈으로
        />
      )}
      <div className="destination-info">
        <p><strong>목적지:</strong> {destination.address || '정보 없음'}</p>
        <p>목적지에 도착하면 훈련이 자동으로 종료됩니다.</p>
      </div>
    </div>
  );
};

export default TrainingPage;


