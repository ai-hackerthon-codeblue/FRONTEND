import { selector } from 'recoil';
import { startPointState, endPointState, userPathState } from './atoms';

/**
 * 훈련 시작 가능 여부를 판단하는 selector
 * 출발지와 목적지가 모두 설정되었는지 확인합니다.
 */
export const isReadyForTrainingState = selector({
  key: 'isReadyForTrainingState',
  get: ({ get }) => {
    const startPoint = get(startPointState);
    const endPoint = get(endPointState);

    // 출발지와 목적지 좌표가 모두 유효한 경우 true를 반환
    return !!(startPoint?.coords && endPoint?.coords);
  },
});

/**
 * 사용자의 훈련 경로 길이를 계산하는 selector
 */
export const userPathLengthState = selector({
    key: 'userPathLengthState',
    get: ({get}) => {
        const path = get(userPathState);
        if (path.length < 2) {
            return 0;
        }

        // 실제 경로 계산 로직은 더 복잡할 수 있으나, 여기서는 포인트 수로 간단히 표현
        return path.length;
    }
});
