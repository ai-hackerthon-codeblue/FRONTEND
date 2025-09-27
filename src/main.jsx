import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App';
import './assets/styles/global.css';

// .env 파일에서 API 키를 가져옵니다.
const naverMapClientId = '%VITE_NAVER_MAPS_CLIENT_ID%';

if (!naverMapClientId) {
  throw new Error("VITE_NAVER_CLIENT_ID가 .env 파일에 설정되지 않았습니다.");
}

// React 앱을 렌더링하는 함수
const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </React.StrictMode>
  );
};

// Naver Maps 스크립트 동적 로딩
const script = document.createElement('script');
script.id = 'naver-maps-script';
script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverMapClientId}&submodules=panorama`;
script.async = true;
script.defer = true;

// 스크립트 로딩이 성공하면 앱을 렌더링합니다.
script.onload = () => {
  console.log("Naver Maps API 스크립트 로딩 성공.");
  renderApp();
};

// 스크립트 로딩 실패 시 에러 메시지를 표시합니다.
script.onerror = () => {
  console.error("Naver Maps 스크립트를 로드하는 데 실패했습니다.");
  document.getElementById('root').innerHTML = '지도 API를 불러오는 데 실패했습니다. 페이지를 새로고침 해주세요.';
};

document.head.appendChild(script);
