import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Popup from './popup';

export default function CheckValidAccess({ check, message }) {
  const router = useRouter();
  const [isInvalid, setIsInvalid] = useState(false);
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    if(!check || check === '') {
      setIsInvalid(true);
      if(isInvalid) {
        setIsPopup(true);
      }
    }
  }, [check, isInvalid]);

  const goToLobby = () => {
    router.replace('/');
  };

  return (
    <> 
    {
      isPopup
      && <Popup 
          title="⛔️잘못된 접근입니다.⛔️"
          content={message}
          label="메인으로"
          onClick={goToLobby} 
        />
    } 
    </>
  )
}