import { atom } from 'recoil';

/**
 * 로딩 상태를 관리하는 atom
 * API 호출 등 비동기 작업 시 사용됩니다.
 */
export const isLoadingState = atom({
  key: 'isLoadingState', // 전역적으로 고유한 ID
  default: false, // 기본값
});

/**
 * 출발지 정보를 저장하는 atom
 * { address: string, coords: naver.maps.LatLng | null } 형태의 객체를 저장합니다.
 */
export const startPointState = atom({
  key: 'startPointState',
  default: null,
});

/**
 * 목적지 정보를 저장하는 atom
 * { address: string, coords: naver.maps.LatLng | null } 형태의 객체를 저장합니다.
 */
export const endPointState = atom({
  key: 'endPointState',
  default: null,
});

/**
 * 사용자가 로드뷰에서 이동한 경로(좌표 배열)를 저장하는 atom
 */
export const userPathState = atom({
  key: 'userPathState',
  default: [], // 기본값은 빈 배열
});

/**
 * 훈련 결과를 저장하는 atom
 * { time: string, analysis: string, accuracy: string } 형태의 객체를 저장합니다.
 */
export const trainingResultState = atom({
  key: 'trainingResultState',
  default: null,
});
