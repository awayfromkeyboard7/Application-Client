import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { socket } from './socket';
import styles from '../styles/pages/code.module.scss';

export default function Voice() {
  const router = useRouter();
  const [peerId, setPeerId] = useState('');
  const [voiceOff, setVoiceOff] = useState(true);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState([]);
  const memberVoiceRefs = useRef([]);
  const peerInstance = useRef(null);
  let peer = null;

  useEffect(() => {
    const fn = async () => {
      const Peer = (await import('peerjs')).default;
      peer = new Peer();

      peer.on('open', (myPeerId) => {
        console.log('[peer] set peer id >> ', myPeerId, router?.query?.roomId);
        setPeerId(myPeerId);
      });

      socket.on('getPeerId', (myPeerId, teamPeerIds) => {
        // teamPeerIds = [{gitId: peerId}]
        console.log('peer] get peer id', myPeerId, teamPeerIds);
        if (!voiceOff) {
          setRemotePeerIdValue(teamPeerIds);
        }
      });

      peer.on('call', (call) => {
        console.log("on Call :::: ");
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: false, audio: true }, (mediaStream) => {
          call.answer(mediaStream)
          call.on('stream', (remoteStream) => {
            console.log('before >>>>> ', memberVoiceRefs);
            for(let i = 0; i < 4; i++) {
              console.log('for >>>>> ', i, memberVoiceRefs , remoteStream);
              if(memberVoiceRefs[i] !== undefined) {
                console.log('if ref null?? ', memberVoiceRefs[i]);
                memberVoiceRefs.current[i].srcObject = remoteStream
                memberVoiceRefs.current[i].play();
              } else {
                console.log('if ref null?? ', i, memberVoiceRefs[i]);
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

  useEffect(() => {
    const peers = Object.entries(remotePeerIdValue);
    for (let i = 0; i < peers.length; i++) {
      if (peers[i][0] !== getCookie('gitId')) {
        console.log("HERE");
        call(memberVoiceRefs.current[i], peers[i][1]);
      }
    }
  }, [remotePeerIdValue])

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
    socket.emit('setPeerId', getCookie('gitId'), peerId, router?.query?.roomId);
    setVoiceOff(false);
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