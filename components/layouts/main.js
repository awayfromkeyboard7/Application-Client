import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { socket } from '../../lib/socket';
import Notification from '../notification';
import Loading from '../loading';
import styles from '../../styles/layouts/main.module.scss';

export default function Main({ header, body }) {
  const router = useRouter();
  const { status } = useSession();
  const [isNoti, setIsNoti] = useState(false);
  const [sender, setSender] = useState(null);

  useEffect(() => {
    if(status === 'authenticated') {
      if(router.pathname === '/' || router.pathname === '/mypage' || router.pathname === '/code/result') {
        socket.on('comeon', userInfo => {
          setSender(userInfo);
          setIsNoti(true);
        });
      }
    }

    return () => {
      socket.off('comeon');
    };
  }, [status, router]);

  const onClickAccept = () => {
    socket.emit('acceptInvite', sender.gitId);
    setIsNoti(false);
    router.replace({
      pathname: '/code/wait',
      query: { mode: 'team', roomId: sender.gitId }
    });
  };

  const onClickDecline = () => {
    setIsNoti(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{`{ CODE: '뚝딱' }`}</title>
        <meta name="description" content="Jungle Online Judge" />
        <link rel="icon" href="/frog.ico" />
      </Head>
      { status === 'loading' && <Loading /> }
      <div className={styles.header}>{header}</div>
      <div className={styles.body}>{body}</div>
      {
        status === 'authenticated' 
        && isNoti
        && <Notification 
            title={`${sender?.gitId}님이 팀전에 초대했습니다!`}
            content="게임에 참가하시겠습니까?"
            imgUrl={sender?.avatarUrl ?? "/default_profile.jpg"}
            onClickAccept={onClickAccept}
            onClickDecline={onClickDecline}
          />
      }
    </div>
  )
}