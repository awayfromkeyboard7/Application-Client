import { useState, useEffect } from 'react';
import Image from 'next/image';
import Friends from './friend/list';
import ChatRoomList from './chat/list';
import styles from '../styles/components/sidebar.module.scss';
import { socket } from '../lib/socket';
import { getCookie, setCookie } from 'cookies-next';

export default function Sidebar({ menu='friends' }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarMenu, setSidebarMenu] = useState(menu);
  const [friend, setFriend] = useState({});

  useEffect(() => {
    if(getCookie('sidebar') === false) {
      setIsSidebarOpen(false);
    }
  }, []);

  const onClickFriend = (friend) => {
    setFriend(friend);
    setSidebarMenu('chat');
    console.log(friend);
    socket.emit("getChatMessage", getCookie('gitId'), friend);
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
      ? <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
          {
            sidebarMenu === 'friends'
            ? <div className={styles.headerTitleActive} onClick={() => setSidebarMenu('friends')}>친구목록</div>
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
            ? <Friends onClick={friend => onClickFriend(friend)} />
            : <ChatRoomList friend={friend} />
          }
          </div>
          <div className={styles.sidebarFooter}>
          </div>     
          <div className={styles.collapseTag} onClick={closeSidebar}>
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