import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image'
import { hasCookie, deleteCookie } from 'cookies-next';
import Loading from './loading';
import styles from '../styles/components/header.module.scss';

export default function Header({ label, onClickBtn }) {
  const router = useRouter();
  const { data, status } = useSession();
  const [isValidUser, setIsValidUser] = useState(false);

  useEffect(() => {
    // console.log('change login status?????????', data, status, isValidUser);
    if(status === 'authenticated') {
      if(hasCookie('uname')) {
        setIsValidUser(true);
      } else {
        sendAccessToken(data.accessToken);
      }
    } else if(status === 'unauthenticated') {
      deleteCookies();
    }
  }, [status])

  const deleteCookies = () => {
    deleteCookie('uid');
    deleteCookie('uname');
    deleteCookie('uimg');
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
        <div className={styles.headerTitle} onClick={goToLobby}>{`{ CODE: ‘뚝딱’ }`}</div>
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