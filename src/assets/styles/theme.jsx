/**
 * 애플리케이션 전체에서 사용될 공통 디자인 토큰(Design Tokens)
 * CSS-in-JS 라이브러리(e.g., Styled-components, Emotion)와 함께 사용하면 좋습니다.
 */
export const theme = {
  colors: {
    primary: '#FF7A00', // 기획서의 활기찬 주황색
    primaryDark: '#E66A00',
    secondary: '#007BFF',
    background: '#FFFFFF',
    text: '#333333',
    textSecondary: '#767676',
    border: '#DDDDDD',
    disabled: '#CCCCCC',
    success: '#28a745',
    error: '#dc3545',
  },
  fontSizes: {
    small: '0.875rem',  // 14px
    base: '1rem',       // 16px
    large: '1.125rem',  // 18px
    xl: '1.25rem',      // 20px
    title: '1.5rem',    // 24px
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};
