import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { socket } from '../../../lib/socket';
import Layout from '../../../components/layouts/main';
import Result from '../../../components/result/box';
import Sidebar from '../../../components/sidebar';
import CheckValidUser from '../../../components/checkValidUser';
import styles from '../../../styles/components/result.module.scss'

export default function ResultPage() {
  const router = useRouter();  
  const [ranks, setRanks] = useState([]);
  const [gameStartAt, setGameStartAt] = useState();
  
  useEffect(() => {
    socket.emit('getRanking', router?.query?.gameLogId);
  }, []);

  useEffect(() => {
    socket.on('getRanking', (ranking, startAt) => {
      setRanks(ranking);
      setGameStartAt(startAt);
    });
  }, [ranks]);

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
          startAt={gameStartAt}
          onClickGoToMain={goToLobby} 
          onClickPlayAgain={goToCode}
        />
        <Sidebar />
        {/* <CheckValidUser /> */}
      </>
      }
    />
  )
}
