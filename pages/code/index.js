import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
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
import Popup from '../../components/popup';
import CheckValidUser from '../../components/checkValidUser';
import CheckValidAccess from '../../components/checkValidAccess';

import 'react-reflex/styles.css';
import styles from '../../styles/pages/Code.module.scss';

let awareness;
let yLines;
let undoManager;

export default function Code() {
  const router = useRouter();  
  const gitId = getCookie('uname');
  const [problems, setProblems] = useState({});
  const [playerList, setPlayerList] = useState([]);
  const [outputs, setOutputs] = useState({});
  const [passRate, setPassRate] = useState(0);
  const [codeText, setCodeText] = useState("print('hello world')");
  const [codeTitle, setCodeTitle] = useState('solution.py');
  const [codeResult, setCodeResult] = useState('');
  const [isSuccessResult, setIsSuccessResult] = useState(true);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupContent, setPopupContent] = useState('');
  const [popupLabel, setPopupLabel] = useState('');
  const [popupBtnFunc, setPopupBtnFunc] = useState(() => () => setIsPopup(false));
  const [selectedLang, setSelectedLang] = useState('Python');
  // const [codemirrorExt, setCodemirrorExt] = useState([python()]);
  const [countdown, setCountdown] = useState(900);
  const [doc, setDoc] = useState();
  const [provider, setProvider] = useState();
  const [isDoc, setIsDoc] = useState(false);

  let yDoc = new Y.Doc();

  const updatePlayerList = (info) => {
    let result = [...playerList];
    console.log('player list >>', playerList);
    for(let player of result) {
      if(player.gitId === info.gitId) {
        player.passRate = info.passRate;
        break;
      }
    }
    console.log('submit code socket result!!!', result);
    setPlayerList(result);
  };

  useEffect(() => {
    socket.on('submitCode', (submitInfo) => {
      console.log('submitInfo>>>>>>', submitInfo);
      updatePlayerList(submitInfo);
    });
  }, [playerList]);

  useEffect(() => {
    const getProblem = async() => {
      await fetch(`/api/gamelog/getGameLog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          gameLogId: router.query.gameLogId
        }),
      })
      .then(res => res.json())
      .then(data => {
        console.log('success get problem!!', data);
        if(data.success) {
          setProblems(data.info.problemId);
          setPlayerList(data.info.userHistory);
        }
      })
      .catch(error => console.log('error >> ', error));
    };

    const date = new Date('2022-07-05T13:00:00');

    const interval = setInterval(() => {
      console.log(new Date());
      setCountdown(prev => {
        if(0 < prev) return prev - 1;
        else return prev;
      });
    }, 1000);

    if(router?.query?.gameLogId && router.query.gameLogId !== '') {
      getProblem();
    }

    return () => {
      clearInterval(interval);
      yProvider.destroy();
    };
  }, []);

  useEffect(() => {
    if(isDoc === false && router?.query?.gameLogId) {
      let yProvider = new WebrtcProvider(router?.query?.gameLogId, yDoc);
      awareness = yProvider.awareness;
      setDoc(yDoc);
      setProvider(yProvider);
      setIsDoc(true);
    }
  }, [router]);

  useEffect(() => {
    if(countdown === 0) {
      judgeCode();
      setIsPopup(true);
    }
  }, [countdown]);

  useEffect(() => {
    if(passRate === 100) {
      setPopupTitle("정답입니다!🥳");
      setPopupContent(`문제를 맞추셨습니다.`);
      setPopupLabel("다음 문제로");
      setPopupBtnFunc(() => () => goToNextProblem());
    } else {
      setPopupTitle("아쉽지만 다음 기회에..😭");
      setPopupContent(`문제를 틀렸습니다.`);
      setPopupLabel("메인으로");
      setPopupBtnFunc(() => () => goToLobby());
    }
  }, [isSuccessResult, selectedLang]);
  
  useEffect(() => {
    onChangeLang(selectedLang);
    setIsSelectOpen(false);
  }, [selectedLang]);

  const secToTime = (s) => {
    const min = "0" + String(parseInt((s % 3600) / 60));
    const sec = "0" + String(parseInt(s % 60));
    
    return `${min.substr(-2)}분 ${sec.substr(-2)}초`;
  };

  const onChange = useCallback((value) => {
    console.log(value);
    setCodeText(value);
  }, []);

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

  const goToNextProblem = () => {
    onChangeLang(selectedLang);
    setOutputs({});
    setCodeResult('');
    setIsPopup(false);
  };

  const goToLobby = () => {
    router.push('/');
  };

  const goToResult = async() => {
    // passRate 계산
    

    await submitCode();
    socket.emit('submitCode', { gitId, passRate });
    router.push({
      pathname: '/code/result',
      query: { gameLogId: router?.query?.gameLogId }
    });
  };

  const submitCode = async() => {
    await judgeCode();
    const code = doc.getText('codemirror');
    console.log('submit code >> ', code);

    await fetch(`/api/gamelog/update`, {
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

  const judgeCode = async() => {
    const code = doc.getText('codemirror');
    console.log('judge code >> ', code);

    await fetch(`/api/judge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        code
      }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.result) setIsSuccessResult(true);
      else setIsSuccessResult(false);
      setOutputs(data);
      console.log('judgeCode >>>>>>', data);
      setPassRate(data.passRate);
      // setPassRate(data.results ? 100 : 0);
    })
    .catch(error => console.log('error >> ', error));
  };

  const judgeCodeWithSocket = async() => {
    await fetch(`/api/judge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        code: codeText 
      }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.result) setIsSuccessResult(true);
      else setIsSuccessResult(false);
    })
    .catch(error => console.log('error >> ', error));
  };

  return (
    <Layout 
      header={
      <>
        <div className={styles.headerRow}>
          <div className={styles.headerLogo} onClick={goToLobby}>{`BLUEFROG`}</div>
          <div className={styles.headerTitle}>{` > ${problems.title ?? ''}`}</div>
        </div>
        <div className={styles.headerRow}>
          <div className={styles.timerIcon}>⏳</div>
          <div className={styles.timer}>{secToTime(countdown)}</div>
        </div>
      </>
      }
      body={<>
      <ReflexContainer>
        <ReflexElement className={styles.body} flex={1}>
          <ReflexContainer orientation='vertical'>
            <ReflexElement className={styles.bodyCol}>
              <ReflexContainer orientation='horizontal'>
                <ReflexElement flex={0.7} style={{ overflow: 'hidden' }}>
                  { problems && <Problem problems={problems}/>}
                </ReflexElement>
                <ReflexSplitter style={{ backgroundColor: "rgba(0, 0, 0, 0.2)", height: "0.625rem", borderTop: "1px solid rgba(0,0,0,0.5)", borderBottom: "0" }} />
                <ReflexElement minSize={40} style={{ overflow: 'hidden' }}>
                  <div className={styles.resultTitle}>플레이어</div>
                  <Player players={playerList} />
                </ReflexElement>
              </ReflexContainer>
            </ReflexElement>
            <ReflexSplitter style={{ backgroundColor: "rgba(0, 0, 0, 0.2)", width: "0.625rem", borderLeft: "0", borderRight: "1px solid rgba(0,0,0,0.5)" }} />
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
                    {/* <CodeMirror
                      value={codeText}
                      width="auto"
                      height="100%"
                      className={styles.CodeMirror}
                      theme={dracula}
                      extensions={codemirrorExt}
                      onChange={onChange}
                    /> */}
                    <Editor 
                      doc={doc} 
                      provider={provider} 
                      gitId={gitId} 
                    />
                  </div>
                </ReflexElement>
                <ReflexSplitter style={{ backgroundColor: "rgba(0, 0, 0, 0.2)", height: "0.625rem", borderTop: "1px solid rgba(0,0,0,0.5)", borderBottom: "0" }} />
                <ReflexElement minSize={40} style={{ overflow: 'hidden' }}>
                  <div className={styles.resultTitle}>실행 결과</div>
                  <Output outputs={outputs}/>
                </ReflexElement>
              </ReflexContainer>
            </ReflexElement>
          </ReflexContainer>
        </ReflexElement>
        <div className={styles.footer}>
          <div />
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
        {
          isPopup
          && <Popup 
              title={popupTitle}
              content={popupContent}
              label={popupLabel}
              onClick={popupBtnFunc} 
            />
        }
        {/* <CheckValidUser /> */}
        {/* <CheckValidAccess check={router.query.gameLogId} message="유효하지 않은 게임입니다." /> */}
        </>
      }
    />
  )
}