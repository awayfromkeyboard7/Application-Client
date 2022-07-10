import { useState, useEffect } from 'react';
import Image from 'next/image'
import { useRouter } from 'next/router';
import Cookie from '../lib/cookie';
import Layout from '../components/layouts/main';
import Friends from '../components/friend/list';
import styles from '../styles/Home.module.css'

export default function Home() {
  const router = useRouter();  
  const [isLogin, setIsLogin] = useState(false);
  const friends = [
    {
      nickname: 'annie1229',
      isOnline: true
    },
    {
      nickname: 'prof.choi',
      isOnline: true
    },
    {
      nickname: 'codeking_moonjiro',
      isOnline: false
    },
    {
      nickname: 'afk7',
      isOnline: false
    },
    {
      nickname: 'larger',
      isOnline: true
    }
  ];
  
  useEffect(() => {
    const token = Cookie.get('userToken');
    if(token) {
      // token이 있으면 서버에 유효한 토큰인지 확인하고 true
      // 유효하지 않으면 false
      setIsLogin(true);
    } else {
      // token이 없으면 false
      setIsLogin(false);
    }
  }, [isLogin]);

  const goToCode = () => {
    router.push('/code');
  };

  const login = async() => {
    await fetch(`/api/login`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      Cookie.set('userToken', 'bluefrog');
      setIsLogin(true);
      router.push(data.url);
    })
    .catch(error => console.log('error >> ', error));
  };

  const logout = async() => {
    Cookie.remove('userToken');
    setIsLogin(false);
  }

  return (
    <Layout 
      header={
      <>
        <div className={styles.headerTitle}>BLUEFROG</div>
        {
          isLogin
          ? <div className={styles.myPageBtn} onClick={logout}>마이페이지</div>
          : <div className={styles.loginBtn}  onClick={login}>
              <Image src="/github.png" alt="github Logo" width={20} height={20} />
              <div className={styles.loginText}>로그인</div>
            </div>
        }
      </>
      }
      body={
      <>
        <div className={styles.box} onClick={goToCode}>
          <div>
            <Image src="/personal.png" alt="personalGame" width={150} height={150} />
            <div className={styles.boxText}>개인전</div>
          </div>
        </div>
        <div className={styles.box}>
          <div>
            <Image src="/team.png" alt="teamGame" width={150} height={150} />
            <div className={styles.boxText}>팀전</div>
          </div>
        </div>
        {
          isLogin
          && <Friends friends={friends} />
        }
      </>
      }
    />
  )
}
