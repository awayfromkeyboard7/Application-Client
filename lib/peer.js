import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import { socket } from './socket';
import styles from '../styles/components/voice.module.scss';

export default function Voice({ team }) {
  const router = useRouter();
  const gitId = getCookie('gitId');
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
        console.log('[peer] get peer id', myPeerId, teamPeerIds);
        setRemotePeerIdValue(teamPeerIds);
      });

      peer.on('call', (call) => {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: false, audio: true }, (mediaStream) => {
          call.answer(mediaStream)
          call.on('stream', (remoteStream) => {
            for(let i = 0; i < team.length; i++) {
              if(memberVoiceRefs[i] !== undefined) {
                memberVoiceRefs.current[i].srcObject = remoteStream;
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
  }, [team]);

  useEffect(() => {
    if(!voiceOff) {
      const peers = Object.entries(remotePeerIdValue);
      for (let i = 0; i < peers.length; i++) {
        if (peers[i][0] !== gitId) {
          call(memberVoiceRefs.current[i], peers[i][1]);
        }
      }
    }
  }, [remotePeerIdValue, voiceOff]);

  const call = (memberRef, remotePeerId) => {
    let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: false, audio: true }, (mediaStream) => {
      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on('stream', (remoteStream) => {
        memberRef.srcObject = remoteStream;
        memberRef.play();
      });
    });
  };

  const voiceChat = () => {
    socket.emit('setPeerId', gitId, peerId, router?.query?.roomId);
    setVoiceOff(false);
  };

  const muteVoice = (idx) => {
    memberVoiceRefs.current[idx].pause();
  };
  
  return (
    <div className={styles.voiceBox}>
      <div className={voiceOff ? styles.voiceBtnDisable : styles.voiceBtn} onClick={voiceOff ? voiceChat : () => {}}>{voiceOff ? `팀 보이스 ON` : `팀 보이스 OFF`}</div>
    {
      team?.map((member, idx) => 
        <div className={voiceOff ? styles.voiceIconDisable : styles.voiceIcon} onClick={() => muteVoice(idx)} key={idx}>
          <Image src={member.avatarUrl ?? '/default_profile.jpg'} width={30} height={30} className={styles.voiceIcon} alt="icon" />
          <div style={{ display: 'none' }}>
            <video ref={el => (memberVoiceRefs.current[idx] = el)} />
          </div>
        </div>  
      )
    }
    </div>
  );
}