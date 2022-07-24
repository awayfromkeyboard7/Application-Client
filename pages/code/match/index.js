import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getCookie } from 'cookies-next';
import { socket } from '../../../lib/socket';
import Layout from '../../../components/layouts/main';
import Header from '../../../components/header';
import Match from '../../../components/match/box';
import Sidebar from '../../../components/sidebar';
import Loading from '../../../components/loading';
import CheckValidAccess from '../../../components/checkValidAccess';

export default function MatchPage() {
  const router = useRouter();  
  const { status } = useSession();
  const gitId = getCookie('gitId');
  const [gameLogId, setGameLogId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);

  useEffect(() => {
    if(status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status]);

  useEffect(() => {
    if (router.isReady) {
      socket.on('matchingComplete', (teamA, teamB) => {
        setTeamA(teamA);
        setTeamB(teamB);
      });
      socket.on('getTeamInfo', users => {
        setTeamA(users);
      });
      socket.on('teamGameStart', (roomId, gameLogId) => {
        setGameLogId(gameLogId);
        setRoomId(roomId);
      });
      socket.emit('getTeamInfo', router?.query?.roomId);
      if (router.query?.roomId === gitId) {
        socket.emit('startMatching', gitId);
      }
    }

    return () => {
      socket.off('matchingComplete');
      socket.off('getTeamInfo');
      socket.off('teamGameStart');
    };
  }, [router.isReady]);


  useEffect(() => {
    if (router?.query?.mode === 'team') {
      socket.on('exitTeamGame', () => {
        router.replace('/');
      });
    } else {
      socket.on('exitWait', (users) => {
        setTeamA(users);
      });
    }

    return () => {
      socket.off('exitTeamGame');
      socket.off('exitWait');
    };
  }, [teamA]);

  useEffect(() => {
    if(gameLogId !== '') {
      router.replace({
        pathname: '/code',
        query: { mode: 'team', gameLogId, roomId }
      });
    }
  }, [gameLogId]);

  const goToLobby = () => {
    if (router?.query?.mode === 'team') {
      socket.emit('exitWait', gitId);
      router.replace('/');
    } else {
      socket.emit('exitWait', gitId);
      router.replace('/');
    }
  };

  const goToMyPage = () => {
    router.replace('/mypage');
  };

  return (
    <Layout 
      header={<Header label="마이페이지" onClickBtn={goToMyPage} />}
      body={
        <>
          { status !== 'authenticated' && <Loading /> }
          { 
            router.isReady
            && <CheckValidAccess check={router?.query?.roomId} message="유효하지 않은 게임입니다." />
          }
          <Match 
            teamA={teamA.slice(0, 4)}
            teamB={teamB.slice(0, 4)}
            onClickGoToMain={goToLobby} 
          />
          <Sidebar hide />
        </>
      }
    />
  )
}
