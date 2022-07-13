import { useState, useEffect } from 'react';
import Image from 'next/image'
import { useRouter } from 'next/router';
import { 
  setCookie, 
  getCookie, 
  hasCookie, 
  deleteCookie 
} from 'cookies-next';
import { socket } from '../lib/socket';
import Layout from '../components/layouts/main';
import Sidebar from '../components/sidebar';
import Popup from '../components/popup';
import styles from '../styles/Home.module.css'

export default function Home() {
  const router = useRouter();  
  const [isLogin, setIsLogin] = useState(false);
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    socket.emit('exitWait', getCookie("uname"));
  }, []);

  useEffect(() => {
    if(hasCookie('uid')) {
      // token이 있으면 서버에 유효한 토큰인지 확인하고 true
      // 유효하지 않으면 false
      setIsLogin(true);
    } else {
      // token이 없으면 false
      setIsLogin(false);
    }
  }, [isLogin]);

  // const goToCode = () => {
  //   router.push('/code');
  // };

  const goToWait = (mode) => {
    if(isLogin) {
      router.push({
        pathname: '/code/wait',
        query: { mode }
      });
    } else {
      setIsPopup(true);
    }
  };

  const goToMyPage = () => {
    if(isLogin) {
      router.push('/mypage');
    } else {
      setIsPopup(true);
    }
  };

  const login = async() => {
    await fetch(`/api/login`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'  
    })
    .then(res => res.json())
    .then(data => router.push(data.url))
    .catch(error => console.log('error >> ', error));
  };

  const logout = async() => {
    deleteCookie('uid');
    setIsLogin(false);
  }

  return (
    <Layout 
      header={
      <>
        <div className={styles.headerTitle}>BLUEFROG</div>
        {
          isLogin
          ? <div className={styles.myPageBtn} onClick={goToMyPage}>마이페이지</div>
          : <div className={styles.loginBtn}  onClick={login}>
              <Image src="/github.png" alt="github Logo" width={20} height={20} />
              <div className={styles.loginText}>로그인</div>
            </div>
        }
      </>
      }
      body={
      <>
        <div className={styles.box} onClick={() => goToWait('personal')}>
          <div>
            <Image src="/personal.png" alt="personalGame" width={150} height={150} />
            <div className={styles.boxText}>개인전</div>
          </div>
        </div>
        <div className={styles.box} onClick={() => goToWait('team')}>
          <div>
            <Image src="/team.png" alt="teamGame" width={150} height={150} />
            <div className={styles.boxText}>팀전</div>
          </div>
        </div>
        {
          isLogin
          && <Sidebar />
        }
        {
          isPopup
          && <Popup 
              title="⛔️로그인이 필요합니다.⛔️"
              content="게임에 참가하시려면 로그인이 필요합니다."
              label="메인으로"
              onClick={() => setIsPopup(false)} 
            />
        } 
      </>
      }
    />
  )
}
