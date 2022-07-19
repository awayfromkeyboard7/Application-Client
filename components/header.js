import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import { hasCookie, deleteCookie } from 'cookies-next';
import Image from 'next/image'
import Loading from './loading';
import styles from '../styles/components/header.module.scss';

export default function Header({ label, onClickBtn, checkValidUser=()=>{} }) {
  const router = useRouter();
  const { data, status } = useSession();
  const [isValidUser, setIsValidUser] = useState(false);

  useEffect(() => {
    console.log('change login status?????????', data, status);
    if(status === "authenticated") {
      // sendAccessToken(data.accessToken);
      if(hasCookie('uname')) {
        checkValidUser(true);
        setIsValidUser(true);
      } else {
        sendAccessToken(data.accessToken);
      }
    } else if(status === 'unauthenticated') {
        deleteCookies();
    }
  }, [status]);

  const deleteCookies = () => {
    deleteCookie('uid');
    deleteCookie('uname');
    deleteCookie('uimg');
    checkValidUser(false);
    setIsValidUser(false);
  };

  const goToLobby = () => {
    router.push('/');
  };

  const sendAccessToken = async(accessToken) => {
    await fetch(`/server/api/user/get-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        checkValidUser(true);
        setIsValidUser(true);
      } else {
        deleteCookies();
        signOut();
      }
    })
    .catch(error => {
      console.log('error >> ', error);
      deleteCookies();
      signOut();
    });
  };

  return (
    <>
      { status === 'loading' && <Loading /> }
      <div className={styles.headerRow}>
        <div className={styles.headerTitle} onClick={goToLobby}>{`{ CODE: '뚝딱' }`}</div>
      </div>
      <div className={styles.headerRow}>
      {
        isValidUser
        ? <div className={styles.myPageBtn} onClick={onClickBtn}>{label}</div>
        : <div className={styles.loginBtn}  onClick={signIn}>
            <Image src="/github.png" alt="github Logo" width={20} height={20} />
            <div className={styles.loginText}>로그인</div>
          </div>
      }
      </div>
    </>
  )
}