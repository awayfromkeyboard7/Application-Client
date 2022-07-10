import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from '../../../lib/cookie';
import Layout from '../../../components/layouts/main';
import Result from '../../../components/result/box';
import Friends from '../../../components/friend/list';
import styles from '../../../styles/components/result.module.scss'

export default function Home() {
  const router = useRouter();  
  const [isLogin, setIsLogin] = useState(false);
  const [ranks, setRanks] = useState([]);
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
    setRanks([
      {
        rank: 1,
        nickname: 'annie1229',
        time: '00분 30초',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 2,
        nickname: 'annie1229',
        time: '',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 3,
        nickname: 'annie1229',
        time: '',
        imageUrl: '/jinny.jpg'
      },
      {
        rank: 4,
        nickname: 'annie1229',
        time: '',
        imageUrl: '/jinny.jpg'
      },
    ]);
  }, []);

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

  return (
    <Layout 
      header={
      <>
        <div className={styles.headerTitle}>BLUEFROG</div>
        <div className={styles.myPageBtn}>마이페이지</div>
      </>
      }
      body={
      <>
        <Result 
          type="personal" 
          ranks={ranks} 
          onClickGoToMain={() => {}} 
          onClickPlayAgain={() => {}}
        />
        <Friends friends={friends} />
      </>
      }
    />
  )
}
