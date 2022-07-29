import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import hark from 'hark';
import { socket } from './socket';
import styles from '../styles/components/voice.module.scss';

export default function Voice({ team }) {
  const router = useRouter();
  const { data } = useSession();
  const [peerId, setPeerId] = useState('');
  const [voiceOn, setVoiceOn] = useState(false);
  const [teamVoiceFlag, setTeamVoiceFlag] = useState([false, false, false, false]);
  const [muteFlag, setMuteFlag] = useState([false, false, false, false]);
  const [isSpeaking, setIsSpeaking] = useState([false, false, false, false]);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState([]);
  const memberVoiceRefs = useRef([]);
  const peerInstance = useRef(null);
  let peer = null;

  useEffect(() => {
    const initVoice = async () => {
      console.log('init voice team >>>', team);
      const Peer = (await import('peerjs')).default;
      peer = new Peer();

      peer.on('open', (myPeerId) => {
        console.log('[peer] set peer id >> ', myPeerId, router?.query?.roomId);
        setPeerId(myPeerId);
      });

      socket.on('getPeerId', (myPeerId, teamPeerIds) => {
        // teamPeerIds = [{ gitId: peerId }]
        console.log('[peer] get peer id', myPeerId, teamPeerIds);
        setRemotePeerIdValue(teamPeerIds);
      });

      peer.on('call', (call) => {
        let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: false, audio: true }, (mediaStream) => {
          call.answer(mediaStream);
          // call.on('stream', (remoteStream) => {
          //   for(let i = 0; i < team.length; i++) {
          //     if(memberVoiceRefs[i] !== undefined) {
          //       memberVoiceRefs.current[i].srcObject = remoteStream;
          //       memberVoiceRefs.current[i].play();

          //       let speechEvents = hark(remoteStream, {});

          //       speechEvents.on('speaking', function () {
          //         console.log('111speaking ~~~~~~', team[i], i);
          //         setIsSpeaking(prev => {
          //           prev[i] = true;
          //           return prev;
          //         });
          //       });

          //       speechEvents.on('stopped_speaking', function () {
          //         console.log('111stop speaking ~~~~~~', team[i], i);
          //         setIsSpeaking(prev => {
          //           prev[i] = false;
          //           return prev;
          //         });
          //       });
          //     }
          //   }
          // });
        });
      });

      peerInstance.current = peer;
    };

    if(team && team.length) {
      initVoice();
    }

    return () => {
      peerInstance.current?.off('open');
      peerInstance.current?.off('call');
      socket.off('getPeerId');
    };
  }, [team?.length]);

  useEffect(() => {
    let voiceFlag = [false, false, false, false];
    const peers = Object.entries(remotePeerIdValue);
    for (let i = 0; i < peers.length; i++) {
      // if(peers[i][1] && peers[i][1] !== '' && !muteFlag[i]) {
      //   voiceFlag.push(true);
      // } else {
      //   voiceFlag.push(false);
      // }
      for(let j = 0; j < team.length; j++) {
        if(peers[i][0] === team[j].gitId) {
          if(peers[i][1] && peers[i][1] !== '' && !muteFlag[j]) {
            voiceFlag[j] = true;
          } else {
            voiceFlag[j] = false;
          }
          break;
        }
      }
    }
    setTeamVoiceFlag(voiceFlag);
  }, [remotePeerIdValue, muteFlag]);

  useEffect(() => {
    if(voiceOn) {
      const peers = Object.entries(remotePeerIdValue);
      for (let i = 0; i < peers.length; i++) {
        if (peers[i][0] !== data?.gitId) {
          // call(memberVoiceRefs.current[i], peers[i][1], i);
          for(let j = 0; j < team.length; j++) {
            if(peers[i][0] === team[j].gitId) {
              call(memberVoiceRefs.current[j], peers[i][1], j);
              break;
            }
          }
        }
      }
    }
  }, [remotePeerIdValue, voiceOn]);

  const call = (memberRef, remotePeerId, idx) => {
    let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: false, audio: true }, (mediaStream) => {
      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on('stream', (remoteStream) => {
        memberRef.srcObject = remoteStream;
        memberRef.play();

        let speechEvents = hark(remoteStream, {});

        speechEvents.on('speaking', function () {
          console.log('speaking ~~~~~~', remotePeerId, team[idx]);
          setIsSpeaking(prev => {
            prev[idx] = true;
            return prev;
          });
        });

        speechEvents.on('stopped_speaking', function () {
          console.log('stop speaking ~~~~~~', remotePeerId, team[idx]);
          setIsSpeaking(prev => {
            prev[idx] = false;
            return prev;
          });
        });
      });
    });
  };

  const startVoiceChat = () => {
    if(peerId !== '') {
      socket.emit('setPeerId', peerId, router?.query?.roomId);
      setVoiceOn(true);
    }
  };

  const playVoice = (idx) => {
    memberVoiceRefs.current[idx].play();
    setTeamVoiceFlag(prev => {
      prev[idx] = true;
      return prev;
    });
    setMuteFlag(prev => {
      prev[idx] = false;
      return prev;
    });
  };

  const muteVoice = (idx) => {
    memberVoiceRefs.current[idx].pause();
    setTeamVoiceFlag(prev => {
      prev[idx] = false;
      return prev;
    });
    setMuteFlag(prev => {
      prev[idx] = true;
      return prev;
    });
  };
  
  return (
    <div className={styles.voiceBox}>
      <div className={voiceOn ? styles.voiceBtn : styles.voiceBtnDisable} onClick={voiceOn ? () => {} : startVoiceChat}>{voiceOn ? `팀 보이스 OFF` : `팀 보이스 ON`}</div>
    {
      team?.map((member, idx) => {
        if(member.gitId === data?.gitId) {
          return (
            <div className={voiceOn ? styles.voiceIcon : styles.voiceIconDisable} key={idx}>
              <Image src={member.avatarUrl ?? '/default_profile.jpg'} width={30} height={30} className={styles.voiceIcon} alt="icon" />
              <div style={{ display: 'none' }}>
                <video ref={el => (memberVoiceRefs.current[idx] = el)} muted />
              </div>
            </div> 
          ) 
        } else {
          return (
            <div className={teamVoiceFlag[idx] ? isSpeaking[idx] ? styles.voiceIconSpeaking : styles.voiceIcon : styles.voiceIconDisable} onClick={teamVoiceFlag[idx] ? () => muteVoice(idx) : () => playVoice(idx)} key={idx}>
              <Image src={member.avatarUrl ?? '/default_profile.jpg'} width={30} height={30} className={styles.voiceIcon} alt="icon" />
              <div style={{ display: 'none' }}>
                <video ref={el => (memberVoiceRefs.current[idx] = el)} />
              </div>
            </div>  
          )
        }
      })
    }
    </div>
  );
}