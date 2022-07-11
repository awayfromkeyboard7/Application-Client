import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import Layout from '../../../components/layouts/main';
import Result from '../../../components/result/box';
import Sidebar from '../../../components/sidebar';
import CheckValidUser from '../../../components/checkValidUser';
import styles from '../../../styles/components/result.module.scss'

export default function ResultPage() {
  const router = useRouter();  
  const [isLogin, setIsLogin] = useState(false);
  const [ranks, setRanks] = useState([]);
  
  useEffect(() => {
    setRanks([
      {
        rank: 1,
        nickname: 'afk7',
        time: '02:30',
        language: 'Python',
        imageUrl: '/jinny.jpg',
        rate: 100
      },
      {
        rank: 2,
        nickname: 'prof.choi',
        time: '01:12',
        language: 'Python',
        imageUrl: '/jinny.jpg',
        rate: 80
      },
      {
        rank: 3,
        nickname: 'annie1229',
        time: '05:06',
        language: 'JavaScript',
        imageUrl: '/jinny.jpg',
        rate: 65
      },
      {
        rank: 0,
        nickname: 'codeking_moonjiro',
        language: 'Python',
        imageUrl: '/jinny.jpg',
        rate: -1
      },
      {
        rank: 0,
        nickname: 'larger',
        language: 'Python',
        imageUrl: '/jinny.jpg',
        rate: -1
      }
    ]);
  }, []);

  useEffect(() => {
    const token = getCookie('uid');
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

  const goToLobby = () => {
    router.push('/');
  };

  return (
    <Layout 
      header={
      <>
        <div className={styles.headerTitle} onClick={goToLobby}>BLUEFROG</div>
        <div className={styles.myPageBtn}>마이페이지</div>
      </>
      }
      body={
      <>
        <Result 
          type="personal" 
          ranks={ranks} 
          onClickGoToMain={goToLobby} 
          onClickPlayAgain={goToCode}
        />
        <Sidebar />
        {/* <CheckValidUser func={() => {}} /> */}
      </>
      }
    />
  )
}
