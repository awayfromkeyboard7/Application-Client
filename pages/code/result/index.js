import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { socket } from '../../../lib/socket';
import Layout from '../../../components/layouts/main';
import Header from '../../../components/header';
import Result from '../../../components/result/soloBox';
import Sidebar from '../../../components/sidebar';
import CheckValidUser from '../../../components/checkValidUser';

export default function ResultPage() {
  const router = useRouter();  
  const [ranks, setRanks] = useState([]);
  const [gameStartAt, setGameStartAt] = useState();
  
  useEffect(() => {
    if(router?.query?.mode === 'team') {
      socket.on('getTeamRanking', (result, startAt) => {
        console.log('get team ranking??????? >>', result, startAt);
        if(result.length !== 0 && result[0].length !== 0 && result[1].length !== 0) {
          setRanks([result[0][0], result[1][0]]);
        }
        setGameStartAt(startAt);
      });
      socket.emit('getTeamRanking', router?.query?.gameLogId);
    } else {
      socket.on('getRanking', (ranking, startAt) => {
        setRanks(ranking);
        setGameStartAt(startAt);
      });
      socket.emit('getRanking', router?.query?.gameLogId);
    }
  }, []);

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
