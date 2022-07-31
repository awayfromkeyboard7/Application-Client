import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { socket } from '../lib/socket';
import Layout from '../components/layouts/main';
import Header from '../components/header';
import LobbyBox from '../components/lobby/box';
import Sidebar from '../components/sidebar';
import Popup from '../components/popup';
import Notification from '../components/notification';

export default function Home() {
  const router = useRouter();  
  const { data } = useSession();
  const [isLogin, setIsLogin] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [isNoti, setIsNoti] = useState(false);
  const [sender, setSender] = useState(null);

  useEffect(() => {
    if(data?.gitId) {
      socket.emit('exitWait');
    }
  }, [data?.gitId]);

  useEffect(() => {
    if(isLogin) {
      socket.on('comeon', userInfo => {
        setSender(userInfo);
        setIsNoti(true);
      });
    }

    return () => {
      socket.off('comeon');
    };
  }, [isLogin]);

  const goToWait = (mode) => {
    const query = mode === 'team' ? { mode, roomId: data?.gitId } : { mode };

    if(isLogin) {
      router.push({
        pathname: '/code/wait',
        query
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

  const onClickAccept = () => {
    socket.emit('acceptInvite', sender.gitId);
    setIsNoti(false);
    router.push({
      pathname: '/code/wait',
      query: { mode: 'team', roomId: sender.gitId }
    });
  };

  const onClickDecline = () => {
    setIsNoti(false);
  };

  return (
    <Layout 
      header={
        <Header 
          label="마이페이지" 
          onClickBtn={goToMyPage} 
          checkValidUser={(isValidUser) => setIsLogin(isValidUser)} 
        />
      }
      body={
        <>
          <LobbyBox mode="solo" onClick={() => goToWait('solo')}/>
          <LobbyBox mode="team" onClick={() => goToWait('team')}/>
          { isLogin && <Sidebar />}
          {
            isPopup
            && <Popup 
                title="⛔️로그인이 필요합니다.⛔️"
                content="게임에 참가하시려면 로그인이 필요합니다."
                label="메인으로"
                onClick={() => setIsPopup(false)} 
              />
          } 
          {
            isLogin 
            && isNoti
            && <Notification 
                title={`${sender?.gitId}님이 팀전에 초대했습니다!`}
                content="게임에 참가하시겠습니까?"
                imgUrl={sender?.avatarUrl ?? "/default_profile.jpg"}
                onClickAccept={onClickAccept}
                onClickDecline={onClickDecline}
              />
          }
        </>
      }
    />
  )
}
