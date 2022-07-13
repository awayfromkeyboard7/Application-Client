import { useState, useEffect } from 'react';
import Image from 'next/image'
import { useRouter } from 'next/router';
import { 
  setCookie, 
  getCookie, 
  hasCookie, 
  deleteCookie 
} from 'cookies-next';
import Layout from '../../components/layouts/main';
import styles from '../../styles/pages/MyPage.module.scss'

export default function MyPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [isPopup, setIsPopup] = useState(false);

  const logout = async() => {
    deleteCookie('uid');
    deleteCookie('uname');
    setIsLogin(false);
    goToLobby();
  }

  const goToLobby = () => {
    router.push('/');
  };

  return (
    <Layout 
      header={
      <>
        <div className={styles.headerTitle} onClick={goToLobby}>BLUEFROG</div>
        <div className={styles.myPageBtn} onClick={logout}>로그아웃</div>
      </>
      }
      body={
      <>
        <div className={styles.mainBox}>
          <div className={styles.profileIcon}>
            <Image src={getCookie('uimg')} width={150} height={150} className={styles.profileIcon} alt="프로필 이미지" />
          </div>
          <div className={styles.nickname}>{getCookie('uname')}</div>
          <div className={styles.scheduleBox}>
            <div className={styles.infoBox}>
              <div className={styles.infoTitle}>게임 전적 내용~~~~</div>
              {/* <div className={styles.infoText}>PM 6:00 ~ 7:00</div> */}
            </div>
            <div className={styles.dateBox}>
              <div className={styles.month}>-></div>
            </div>
          </div>
        </div>
      </>
      }
    />
  )
}