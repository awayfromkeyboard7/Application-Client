import { useState, useLayoutEffect } from 'react';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import { getCookie, setCookie } from 'cookies-next';
import { socket } from '../lib/socket';
import Friends from './friend/list';
import ChatRoomList from './chat/list';
import styles from '../styles/components/sidebar.module.scss';

export default function Sidebar({ menu='friends', players=null, hide=false }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarMenu, setSidebarMenu] = useState(menu);
  const [friend, setFriend] = useState({});
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  useLayoutEffect(() => {
    if(getCookie('sidebar') === false || isMobile || hide) {
      setIsSidebarOpen(false);
    }
  }, []);

  const onClickFriend = (friend) => {
    setFriend(friend);
    setSidebarMenu('chat');
    socket.emit('getChatMessage', friend.gitId);
  };

  const onClickBack = () => {
    setSidebarMenu('friends');
  };

  const openSidebar = () => {
    setCookie('sidebar', true);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setCookie('sidebar', false);
    setIsSidebarOpen(false);
  };

  return (
    <>
    {
      isSidebarOpen
      ? <div className={(isMobile || hide) ? styles.sidebarMobile : styles.sidebar}>
          <div className={styles.sidebarHeader}>
          {
            sidebarMenu === 'friends'
            ? <div className={styles.headerTitleActive}>내 정보</div>
            : <div className={styles.headerTitleActive}>
                <div className={styles.header}>
                  <div className={styles.icon} onClick={onClickBack}>
                    <Image src="/back_white.png" width={25} height={25} className={styles.icon} />
                  </div>
                  <div className={styles.title}>{friend.gitId}</div>
                  <div className={styles.icon}></div>
                </div>
              </div>
          }
          </div>
          <div className={styles.sidebarBody}>
          {
            sidebarMenu === 'friends'
            ? <Friends onClick={friend => onClickFriend(friend)} players={players} />
            : <ChatRoomList friend={friend} />
          }
          </div> 
          <div className={isMobile ? styles.collapseTagMobile : styles.collapseTag} onClick={closeSidebar}>
            <Image src="/collapse.png" width={30} height={30} className={styles.collapseTag} alt="close sidebar" />
          </div> 
        </div>
    : <div className={styles.sidebarClose}>
        <div className={styles.collapseTag} onClick={openSidebar}>
          <Image src="/collapse_open.png" width={30} height={30} alt="open sidebar" />
        </div>
      </div>
  }
  </>
  )
}