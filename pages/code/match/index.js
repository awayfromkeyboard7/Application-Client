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

export default function MatchPage() {
  const router = useRouter();  
  const { status } = useSession();
  const [gameLogId, setGameLogId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if(status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

  useEffect(() => {
    if (router.isReady) {
      if (router.query?.roomId === getCookie('uname')) {
        socket.emit('startMatching', getCookie('uname'));
      }
      socket.on('getTeamInfo', users => {
        setPlayers(users);
      });
      socket.emit('getTeamInfo', router?.query?.roomId);
      socket.on('teamGameStart', (roomId, gameLogId) => {
        setGameLogId(gameLogId);
        setRoomId(roomId);
      })
    }
  }, [router.isReady]);


  useEffect(() => {
    if (router?.query?.mode === 'team') {
      socket.on('exitTeamGame', () => {
        router.push('/');
      });
    } 
    else {
      socket.on('exitWait', (users) => {
        setPlayers(users);
      });
    }

  }, [players]);

  useEffect(() => {
    if(gameLogId !== '') {
      router.push({
        pathname: '/code',
        query: { mode: 'team', gameLogId, roomId }
      });
    }
  }, [gameLogId]);
  
  const startGame = async() => {
    await fetch(`/server/api/gamelog/createNew`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        players
      }),
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        setGameLogId(data.gameLogId);
        socket.emit('startGame', data.gameLogId);
      }
    })
    .catch(error => console.log('error >> ', error));
  };

  const goToCode = async () => {
    await startGame();
  };

  const goToLobby = () => {
    if (router?.query?.mode === 'team') {
      socket.emit('exitTeamGame', router?.query?.roomId, getCookie('uname'));
    } 
    else {
      socket.emit('exitWait', getCookie('uname'));
      router.push('/');
    }
  };

  const goToMyPage = () => {
    router.push('/mypage');
  };

  return (
    <Layout 
      header={<Header label="마이페이지" onClickBtn={goToMyPage} />}
      body={
        <>
          { status !== 'authenticated' && <Loading /> }
          <Match 
            type={router?.query?.mode} 
            players={players} 
            onClickGoToMain={goToLobby} 
            onClickPlayAgain={goToCode}
          />
          <Sidebar />
        </>
      }
    />
  )
}
