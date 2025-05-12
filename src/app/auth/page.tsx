import styles from './main.module.css';

export const metadata = {
  title: '로그인',
};

export default function AuthPage() {
  return (
    <div className={styles.container}>
      <div className={styles.overlay} /> {/* 배경 어둡게 덮는 레이어 */}

      <div className={styles.leftShape}>
        <div className={styles.textBlock}>
          <img
            src="/logo1.png"
            alt="OneClick 로고"
            style={{ width: '200px', margin: '0 auto' }}
          />
          <p>
            원하는 서버를 바로 생성하고<br />
            더 나은 환경을 경험하세요<br />
          </p>
        </div>
      </div>

      <div className={styles.rightShape} />
    </div>
  );
}
