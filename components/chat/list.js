import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import { socket } from '../../lib/socket';
import styles from '../../styles/components/chat.module.scss';


export default function ChatList({ roomName, onClickBack }) {
  const nickname = getCookie('gitId');
  const [text, setText] = useState('');
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    socket.on('receiveChatMessage', chatLogs => {
      console.log('receiveChatMessage', chatLogs);
      setChatList(chatLogs);
    });
    socket.on('sendChatMessage', message => {
      console.log('sendChatMessage', message, message['senderId'], roomName);
      if (message['senderId'] === roomName) {
        setChatList(prev => [...prev, message]);
      }
    });
  }, []);

  useEffect(() => {
    // 나: getCookie('gitId') -> 친구: roomName
    socket.emit("getChatMessage", getCookie('gitId'), roomName);
  }, [roomName]);

  const ChatItem = ({ chat }) => {
    return (
      <div className={styles.chatBox}>
        <div className={styles.profileIcon}>
          <Image src="/jinny.jpg" className={styles.profileIcon} width={32} height={32} alt="profile" />
        </div>
        <div className={styles.chatCol}>
          <div className={styles.nickname}>{chat.senderId}</div>
          <div className={styles.chatRow}>
            <div className={styles.chatTextBox}>{chat.text}</div>
            <div className={styles.time}>{unixToTime(chat.sendAt)}</div>
          </div>
        </div>
      </div>
    )
  };

  const ChatItemMine = ({ chat }) => {
    return (
      <div className={styles.chatBoxMine}>
        <div className={styles.chatRow}>
          <div className={styles.timeMine}>{unixToTime(chat.sendAt)}</div>
          <div className={styles.chatTextBoxMine}>{chat.text}</div>
        </div>
      </div>
    )
  };

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const newMessage = {
      text,
      senderId: nickname,
      messageId: Math.floor(Math.random() * 10000),
      sendAt: new Date().getTime()
    }
    socket.emit('sendChatMessage', getCookie('gitId'), roomName, newMessage);
    if(text !== '') {
      setChatList([...chatList, newMessage]);
      setText('');
    }
  };

 
  const unixToTime = (ts) => {
    const date = new Date(ts);
    const year = date.getFullYear();
    const month = '0' + (date.getMonth()+1);
    const day = date.getDate();
    let hour = '0' + date.getHours();
    const min = '0' + date.getMinutes();
    const isAM = date.getHours() < 12 ? true : false;

    if(!isAM) hour = '0' + (date.getHours() - 12);
    
    return `${isAM ? '오전' : '오후'} ${hour.substr(-2)}:${min.substr(-2)}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        <div className={styles.header}>
          <div className={styles.icon} onClick={onClickBack}>
            <Image src="/back.png" width={25} height={25} className={styles.icon} />
          </div>
          <div className={styles.title}>{roomName}</div>
          <div className={styles.icon}></div>
        </div>
        <div className={styles.body}>
        {
          chatList?.map(chat => 
            chat.senderId === nickname
            ? <ChatItemMine chat={chat} key={chat.messageId} />
            : <ChatItem chat={chat} key={chat.messageId} />
          )
        }
        </div>
      </div>
      <form className={styles.form} onSubmit={onSubmit}>
        <input className={styles.input} type="text" placeholder="내용을 입력하세요." value={text} onChange={onChange} />
        <input className={styles.myPageBtn} type="submit" value="전송" />
      </form>
    </div>
  )
}

