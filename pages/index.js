import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  getCookie, 
  hasCookie
} from 'cookies-next';
import { socket } from '../lib/socket';
import Layout from '../components/layouts/main';
import Header from '../components/header';
import LobbyBox from '../components/lobby/box';
import Sidebar from '../components/sidebar';
import Popup from '../components/popup';

export default function Home() {
  const router = useRouter();  
  const [isLogin, setIsLogin] = useState(false);
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    socket.emit('exitWait', getCookie('uname'));
  }, []);

  useEffect(() => {
    if(hasCookie('uid')) {
      // token이 있으면 서버에 유효한 토큰인지 확인하고 true
      // 유효하지 않으면 false
      setIsLogin(true);
    } else {
      // token이 없으면 false
      setIsLogin(false);
    }
  }, [isLogin]);

  const goToWait = (mode) => {
    if(isLogin) {
      router.push({
        pathname: '/code/wait',
        query: { mode }
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

  return (
    <Layout 
      header={<Header label="마이페이지" onClickBtn={goToMyPage} />}
      body={
      <>
        <LobbyBox mode="personal" onClick={() => goToWait('personal')}/>
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
      </>
      }
    />
  )
}
