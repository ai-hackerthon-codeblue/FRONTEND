/**
 * Naver Maps API 및 백엔드 서버와 통신하는 함수들을 모아놓은 모듈
 */

// 주소를 위경도 좌표로 변환하는 함수 (Geocoding)
export const geocodeAddress = (address) => {
  return new Promise((resolve, reject) => {
    // Service 모듈이 로드되었는지 직접 확인합니다.
    if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
      return reject(new Error("Naver Maps API의 'services' 모듈이 로드되지 않았습니다."));
    }
    
    window.naver.maps.Service.geocode({ query: address }, (status, response) => {
      if (status === window.naver.maps.Service.Status.OK && response.v2.addresses.length > 0) {
        resolve(response.v2.addresses[0]);
      } else {
        reject(new Error(`'${address}' 주소 변환에 실패했습니다. 상태: ${status}`));
      }
    });
  });
};

// 특정 좌표에서 가장 가까운 파노라마 ID(로드뷰 위치)를 찾는 함수
export const getNearestPanorama = (position) => {
  return new Promise((resolve, reject) => {
    if (!window.naver || !window.naver.maps || !window.naver.maps.Panorama) {
       return reject(new Error("Naver Maps Panorama 모듈이 로드되지 않았습니다."));
    }
    
    window.naver.maps.Panorama.getPanoramaByLocation(position, (panoData) => {
      if (panoData) {
        resolve(panoData);
      } else {
        reject(new Error("해당 위치 근처에서 로드뷰를 찾을 수 없습니다."));
      }
    });
  });
};

// 백엔드로 훈련 경로 데이터를 전송하는 함수
export const sendPathData = async (pathData, start, destination) => {
  try {
    const response = await fetch('https://34c3ed685c41.ngrok-free.app/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: pathData,
        start: start,
        destination: destination,
       }),
    });

    if (!response.ok) {
      throw new Error(`서버 응답 오류: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("경로 데이터 전송 실패:", error);
    // 에러를 다시 던져서 호출한 쪽에서 처리할 수 있도록 함
    throw error;
  }
};
