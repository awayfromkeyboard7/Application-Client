import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { socket } from '../../../lib/socket';
import Layout from '../../../components/layouts/main';
import Header from '../../../components/header';
import Result from '../../../components/result/box';
import Sidebar from '../../../components/sidebar';
import CheckValidUser from '../../../components/checkValidUser';

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

  const goToWait = () => {
    router.push({
      pathname: '/code/wait',
      query: { mode: router?.query?.mode }
    });
  };

  const goToMyPage = () => {
    router.push('/mypage');
  };

  const goToLobby = () => {
    router.push('/');
  };

  return (
    <Layout 
      header={<Header label="마이페이지" onClickBtn={goToMyPage} />}
      body={
        <>
          <Result 
            type={router?.query?.mode}
            ranks={ranks} 
            startAt={gameStartAt}
            onClickGoToMain={goToLobby} 
            onClickPlayAgain={goToWait}
          />
          <Sidebar />
          <CheckValidUser />
        </>
      }
    />
  )
}
