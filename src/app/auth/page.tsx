import Image from 'next/image';
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
          {/* img태그를 Image 태그로 바꿨습니다.
              Next.js 권장사항이래요 */}
          <Image
            src="/logo1.png"
            alt="OneClick 로고"
            width={200}
            height={0}
            className='my-0 mx-auto'
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
