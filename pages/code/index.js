import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex';
import { getCookie } from 'cookies-next';
import { socket } from '../../lib/socket';
import Layout from '../../components/layouts/main';
import Editor from '../../components/code/editor';
import Problem from '../../components/code/problem';
import Player from '../../components/code/player';
import Output from '../../components/code/output';
const Voice = dynamic(() => import('../../lib/peer'));
import Loading from '../../components/loading';
import CheckValidAccess from '../../components/checkValidAccess';
import 'react-reflex/styles.css';
import styles from '../../styles/pages/code.module.scss';

export default function Code() {
  const router = useRouter();  
  const { status } = useSession();
  const gitId = getCookie('uname');
  const [problems, setProblems] = useState({});
  const [playerList, setPlayerList] = useState([]);
  const [outputs, setOutputs] = useState({});
  const [passRate, setPassRate] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [codeText, setCodeText] = useState("print('hello world')");
  const [codeTitle, setCodeTitle] = useState('solution.py');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('Python');
  // const [codemirrorExt, setCodemirrorExt] = useState([python()]);
  const [countdown, setCountdown] = useState(899);
  const [doc, setDoc] = useState();
  const [provider, setProvider] = useState();
  const [isDoc, setIsDoc] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);

  let yDoc = new Y.Doc();

  useEffect(() => {
    socket.on('timeLimitCode', ts => {
      setCountdown(parseInt(ts / 1000));
    });

    socket.on('timeOutCode', () => {
      setCountdown(0);
    });
    
    // park-hg start
    socket.on('submitCode', (submitInfo) => {
      setPlayerList(submitInfo);
    });
    socket.on('submitCodeTeam', (result) => {
      console.log('submitCodeTeam!!!!!!!!!!!!!>>>>>>>>>>', result);
      setPlayerList([result[0][0], result[1][0]]);
    });
    socket.on('teamGameOver', () => {
      console.log('teamGameOver');
      router.push({
        pathname: '/code/result',
        query: { 
          gameLogId: router?.query?.gameLogId,
          mode: router?.query?.mode 
        }
      });
    });
    socket.on('shareJudgedCode', (data) => {
      console.log('shareJudgedCode', data)
      setOutputs(data);
    });
    // park-hg end
  }, []);

  useEffect(() => {
    if(status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

  useEffect(() => {
    const submitResult = async() => {
      //도현 분기처리 추가
      console.log("what mode submit code at????????", router?.query?.roomId);
      if (router?.query?.mode === "team"){
        await submitCodeTeam();
        socket.emit('submitCodeTeam', router?.query?.gameLogId, router?.query?.roomId);
      }
      else {
        console.log("team should not be here!!!!!!!!!!!!");
        await submitCode();
        socket.emit('submitCode', router?.query?.gameLogId);
      };
      router.push({
        pathname: '/code/result',
        query: { 
          gameLogId: router?.query?.gameLogId,
          mode: router?.query?.mode 
        }
      });
    };

    if(isSubmit) {
      console.log('team mode submit???????');
      submitResult();
      setIsSubmit(false);
    }
  }, [isSubmit]);

  useEffect(() => {
    if(router.isReady) {
      const getProblem = async() => {
        await fetch(`/server/api/gamelog/getGameLog`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            gameLogId: router?.query?.gameLogId,
            mode: router?.query?.mode
          }),
        })
        .then(res => res.json())
        .then(data => {
          if(data.success) {
            setProblems(data.info.problemId);
            setPlayerList(data.info.userHistory);
          }
        })
        .catch(error => console.log('error >> ', error));
      };

      if(router?.query?.gameLogId && router.query.gameLogId !== '') {
        getProblem();
      }

      if(isDoc === false && router?.query?.gameLogId) {
        const url = router?.query?.mode === 'team' ? `${router?.query?.roomId}_${router?.query?.gameLogId}` : `${gitId}_${router?.query?.gameLogId}`
        let yProvider = new WebrtcProvider(url, yDoc);
        setDoc(yDoc);
        setProvider(yProvider);
        setIsDoc(true);

        return () => {
          yProvider.destroy();
        }
      }
    }
  }, [router]);

  useEffect(() => {
    const timeOutJudge = async() => {
      await judgeCode(true);
    }

    if(countdown === 0 && isTimeout === false) {
      if(router.isReady) {
        if(router?.query?.mode === 'team') {
          if(router?.query?.roomId === getCookie('uname')) {
            timeOutJudge();
          }
        } else {
          timeOutJudge();
        }
      }
      setIsTimeout(true);
    }
  }, [countdown, router.isReady]);
  
  useEffect(() => {
    onChangeLang(selectedLang);
    setIsSelectOpen(false);
  }, [selectedLang]);

  const secToTime = (s) => {
    const min = '0' + String(parseInt((s % 3600) / 60));
    const sec = '0' + String(parseInt(s % 60));
    
    return `${min.substr(-2)}분 ${sec.substr(-2)}초`;
  };

  const onChangeLang = (lang) => {
    switch(lang) {
      case 'JavaScript':
        // setCodemirrorExt([javascript()]);
        setCodeText("console.log('hello world');");
        setCodeTitle('solution.js');
        break;
      case 'Python':
        // setCodemirrorExt([python()]);
        setCodeText("print('hello world')");
        setCodeTitle('solution.py');
        break;
      case 'C++':
        // setCodemirrorExt([cpp()]);
        setCodeText('std::cout << "출력 ";');
        setCodeTitle('solution.cpp');
        break;
    }
  };

  const goToLobby = () => {
    router.push('/');
  };

  const goToResult = async() => {
    await judgeCode(true);
  };

  const submitCode = async() => {
    const code = doc?.getText('codemirror');

    await fetch(`/server/api/gamelog/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        gameId: router.query.gameLogId,
        gitId,
        code,
        language: selectedLang,
        ranking: 0,
        passRate,
        submitAt: new Date()
      }),
    })
    .then(res => console.log('submit code!! ', res))
    .catch(error => console.log('error >> ', error));
  };

  //도현 추가
  const submitCodeTeam = async() => {
    const code = doc?.getText('codemirror');

    await fetch(`/server/api/gamelog/updateTeam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        submitAt: new Date(),
        gameId: router.query.gameLogId,
        gitId,
        code,
        language: selectedLang,
        ranking: 0,
        passRate,
        moderater: router?.query?.roomId
      }),
    })
    .then(res => console.log('submit code team!! ', res))
    .catch(error => console.log('error >> ', error));
  }

  const judgeCode = async(submit=false) => {
    const code = doc?.getText('codemirror');
    console.log("timeout judgeCode????", code, 'problemId', problems._id, 'lang', selectedLang);
    await fetch(`/server/api/judge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        code: code ?? '',
        gitId,
        problemId: problems?._id ?? '',
        language: selectedLang
      }),
    })
    .then(res => res.json())
    .then(data => {

      setOutputs(data);
      // park-hg start
      // 팀원 중 한명이 제출하면 다같이 결과를 공유
      if (router?.query?.mode === 'team') {
        socket.emit("shareJudgedCode", data, router?.query?.roomId);
      }
      console.log('judgeCode >>>>>>', data);
      // park-hg end

      setPassRate(data.passRate);
      if(submit === true) {
        setIsSubmit(true);
      }
    })
    .catch(error => console.log('error >> ', error));
  };

  return (
    <Layout 
      header={
      <>
        <div className={styles.headerRow}>
          <div className={styles.headerLogo} onClick={goToLobby}>{`{ CODE: ‘뚝딱’ }`}</div>
          <div className={styles.headerTitle}>{` > ${problems.title ?? ''}`}</div>
        </div>
        <div className={styles.headerRow}>
          <div className={styles.timerIcon}>⏳</div>
          <div className={styles.timer}>{secToTime(countdown)}</div>
        </div>
      </>
      }
      body={
        <>
          { status !== 'authenticated' && <Loading /> }
          <ReflexContainer>
            <ReflexElement className={styles.body} flex={1}>
              <ReflexContainer orientation='vertical'>
                <ReflexElement className={styles.bodyCol}>
                  <ReflexContainer orientation='horizontal'>
                    <ReflexElement flex={0.7} style={{ overflow: 'hidden' }}>
                      { problems && <Problem problems={problems}/>}
                    </ReflexElement>
                    <ReflexSplitter style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', height: '0.625rem', borderTop: '1px solid rgba(0,0,0,0.5)', borderBottom: '0' }} />
                    <ReflexElement minSize={40} style={{ overflow: 'hidden' }}>
                      <div className={styles.resultTitle}>플레이어</div>
                      <Player players={playerList} />
                    </ReflexElement>
                  </ReflexContainer>
                </ReflexElement>
                <ReflexSplitter style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', width: '0.625rem', borderLeft: '0', borderRight: '1px solid rgba(0,0,0,0.5)' }} />
                <ReflexElement className={styles.bodyCol} flex={0.65}>
                  <ReflexContainer orientation='horizontal'>
                    <ReflexElement flex={0.7} minSize={40} style={{ overflow: 'hidden' }}>
                      <div className={styles.codeHeader}>
                        <div className={styles.codeTitle}>{codeTitle}</div>
                        <div className={styles.toggleBtn} onClick={() => setIsSelectOpen(prev => !prev)}>
                          {selectedLang}
                        </div>
                      </div>
                      <div className={styles.codeArea}>
                        <Editor 
                          doc={doc} 
                          provider={provider} 
                          gitId={gitId} 
                          selectedLang={selectedLang}
                        />
                      </div>
                    </ReflexElement>
                    <ReflexSplitter style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', height: '0.625rem', borderTop: '1px solid rgba(0,0,0,0.5)', borderBottom: '0' }} />
                    <ReflexElement minSize={40} style={{ overflow: 'hidden' }}>
                      <div className={styles.resultTitle}>실행 결과</div>
                      <Output outputs={outputs}/>
                    </ReflexElement>
                  </ReflexContainer>
                </ReflexElement>
              </ReflexContainer>
            </ReflexElement>
            <div className={styles.footer}>
              {
                router?.query?.mode === 'team'
                ? <Voice />
                : <div />
              }
              <div className={styles.footerRight}>
                <div className={styles.btn} onClick={judgeCode}>코드 실행</div>
                <div className={`${styles.btn} ${styles.btnSubmit}`} onClick={goToResult}>코드 제출</div>
              </div>
            </div>
          </ReflexContainer>
          <div className={isSelectOpen ? styles.selectList : styles.hidden}>
            <div className={styles.selectElem} onClick={() => setSelectedLang('C++')}>C++</div>
            <div className={styles.selectElem} onClick={() => setSelectedLang('Python')}>Python</div>
            <div className={styles.selectElem} onClick={() => setSelectedLang('JavaScript')}>JavaScript</div>
          </div>
          {/* <CheckValidAccess check={router.query.gameLogId} message="유효하지 않은 게임입니다." /> */}
        </>
      }
    />
  )
}