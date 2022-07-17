import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
// import Peer from 'peerjs';
import { getCookie } from 'cookies-next';
import { socket } from './socket';
import styles from '../styles/pages/code.module.scss';

export default function Voice() {
  const router = useRouter();
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    const fn = async () => {
      const Peer = (await import('peerjs')).default;
      // set it to state here
      const peer = new Peer();

      peer.on('open', (id) => {
        socket.emit('setPeerId', router?.query?.roomId, id);
        console.log('[peer] set peer id >> ', router?.query?.roomId, id);
        setPeerId(id);
      });

      socket.on('getPeerId', (id) => {
        console.log('peer] get peer id', id);
        setRemotePeerIdValue(id);
      });

      peer.on('call', (call) => {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: false, audio: true }, (mediaStream) => {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
          call.answer(mediaStream)
          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream
            remoteVideoRef.current.play();
          });
        });
      })

      peerInstance.current = peer;
    }
    fn();
  }, [])

  const call = (remotePeerId) => {
    let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: false, audio: true }, (mediaStream) => {

      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream)

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream
        remoteVideoRef.current.play();
      });
    });
  }

  const voiceChat = () => {
    if(remotePeerIdValue !== '') {
      call(remotePeerIdValue);
    }
  };

  return (
    <div className={styles.voiceBtn} onClick={voiceChat}>
      팀보이스
      <div style={{ display: 'none'}}>
        <video ref={currentUserVideoRef} />
      </div>
      <div style={{ display: 'none'}}>
        <video ref={remoteVideoRef} />
      </div>
    </div>
  );
}