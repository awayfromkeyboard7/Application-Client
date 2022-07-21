import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { socket } from './socket';
import styles from '../styles/pages/code.module.scss';

export default function Voice() {
  const router = useRouter();
  const [peerId, setPeerId] = useState('');
  const [voiceOff, setVoiceOff] = useState(false);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState([]);
  const memberVoiceRefs = useRef([]);
  const peerInstance = useRef(null);

  useEffect(() => {
    const fn = async () => {
      const Peer = (await import('peerjs')).default;
      const peer = new Peer();

      peer.on('open', (myPeerId) => {
        socket.emit('setPeerId', getCookie('gitId'), myPeerId, router?.query?.roomId);
        console.log('[peer] set peer id >> ', myPeerId, router?.query?.roomId);
        setPeerId(myPeerId);
      });

      socket.on('getPeerId', (myPeerId, teamPeerIds) => {
        // teamPeerIds = [{gitId: peerId}]
        console.log('[peer] get peer id', myPeerId, teamPeerIds);
        setRemotePeerIdValue(teamPeerIds);
      });

      peer.on('call', (call) => {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: false, audio: true }, (mediaStream) => {
          call.answer(mediaStream)
          call.on('stream', (remoteStream) => {
            for(let i = 0; i < 4; i++) {
              if(memberVoiceRefs[i].current === null || memberVoiceRefs[i].current === undefined) {
                memberVoiceRefs.current[i].srcObject = remoteStream
                memberVoiceRefs.current[i].play();
              }
            }
          });
        });
      })
      peerInstance.current = peer;
    }
    fn();

    return () => {
      socket.off('getPeerId');
    };
  }, []);

  const call = (memberRef, remotePeerId) => {
    let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: false, audio: true }, (mediaStream) => {
      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on('stream', (remoteStream) => {
        memberRef.srcObject = remoteStream
        memberRef.play();
      });
    });
  }

  const voiceChat = () => {
    // setVoiceOff(prevStatus => prevStatus ? false : true);
    // console.log('voice on?', voiceOff, remotePeerIdValue);
    // if (!voiceOff) {
      const peers = Object.entries(remotePeerIdValue);
      for (let i = 0; i < peers.length; i++) {
        if (peers[i][0] !== getCookie('gitId')) {
          call(memberVoiceRefs.current[i], peers[i][1]);
        }
      }
    // }
  };

  return (
    <div className={styles.voiceBtn} onClick={voiceChat}>
      팀보이스
      <div style={{ display: 'none'}}>
      <video ref={el => (memberVoiceRefs.current[0] = el)} />
      <video ref={el => (memberVoiceRefs.current[1] = el)} />
      <video ref={el => (memberVoiceRefs.current[2] = el)} />
      <video ref={el => (memberVoiceRefs.current[3] = el)} />
      </div>
    </div>
  );
}