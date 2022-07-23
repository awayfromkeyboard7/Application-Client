import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { socket } from '../../../lib/socket';
import Layout from '../../../components/layouts/main';
import Header from '../../../components/header';
import Result from '../../../components/result/soloBox';
import TeamResult from '../../../components/result/teamBox';
import Sidebar from '../../../components/sidebar';
import Loading from '../../../components/loading';
import CheckValidAccess from '../../../components/checkValidAccess';

export default function ResultPage() {
  const router = useRouter();  
  const { status } = useSession();
  const [ranks, setRanks] = useState([]);
  const [gameStartAt, setGameStartAt] = useState();
  
  useEffect(() => {
    if(status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

  useEffect(() => {
    if(router?.query?.mode === 'team') {
      socket.on('getTeamRanking', (result, startAt) => {
        if(result.length !== 0 && result[0].length !== 0 && result[1].length !== 0) {
          setRanks([result[0], result[1]]);
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

    return () => {
      socket.off('getTeamRanking');
      socket.off('getRanking');
    };
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
          { status !== 'authenticated' && <Loading /> }
          { 
            router.isReady
            && <CheckValidAccess check={router?.query?.gameLogId} message="유효하지 않은 게임입니다." />
          }
          {
            router?.query?.mode === 'team'
            ? <TeamResult 
                ranks={ranks.splice(4)} 
                startAt={gameStartAt}
                onClickGoToMain={goToLobby} 
                onClickPlayAgain={goToWait}
              />
            : <Result 
                ranks={ranks} 
                startAt={gameStartAt}
                onClickGoToMain={goToLobby} 
                onClickPlayAgain={goToWait}
              />
          }
          <Sidebar />
        </>
      }
    />
  )
}
