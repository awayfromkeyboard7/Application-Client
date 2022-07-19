import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import Popup from './popup';

export default function CheckValidUser() {
  const router = useRouter();  
  const gitId = getCookie('nodeId');
  const [isInvalid, setIsInvalid] = useState(false);
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    if(!gitId) {
      setIsInvalid(true);
      if(isInvalid) {
        setIsPopup(true);
      }
    }
  }, [gitId, isInvalid]);

  const goToLobby = () => {
    setIsPopup(false);
    router.push('/');
  };

  return (
  <> 
  {
    isPopup
    && <Popup 
        title="⛔️잘못된 접근입니다.⛔️"
        content="게임에 참가하시려면 로그인이 필요합니다."
        label="메인으로"
        onClick={goToLobby} 
      />
  } 
  </>
  )
}