import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import TrainingPage from './pages/TrainingPage.jsx';
import ResultPage from './pages/ResultPage.jsx';

/**
 * 애플리케이션의 최상위 컴포넌트입니다.
 * Naver Maps API 스크립트 로딩은 main.jsx에서 처리하므로,
 * 이 컴포넌트는 페이지 경로를 설정(라우팅)하는 역할만 담당합니다.
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* '/' 경로로 접속하면 HomePage를 보여줍니다. */}
        <Route path="/" element={<HomePage />} />

        {/* '/training' 경로로 접속하면 TrainingPage를 보여줍니다. */}
        <Route path="/training" element={<TrainingPage />} />

        {/* '/result' 경로로 접속하면 ResultPage를 보여줍니다. */}
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;

