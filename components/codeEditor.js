import { useEffect, useRef } from 'react';
import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import * as random from 'lib0/random';
import '../styles/components/code/editor.module.css';
import styles from '../styles/components/codeEditor.module.scss';

export const usercolors = [
  { color: '#6C5B7B', light: '#6C5B7B33' }, // 애쉬보라
  { color: '#7C46E0', light: '#7C46E033' }, // 보라
  { color: '#355C7D', light: '#355C7D33' }, // 파랑
  { color: '#ffbc42', light: '#ffbc4233' }, // 인디핑크
  { color: '#F67280', light: '#F6728033' }, // 핑크
  { color: '#F2D096', light: '#F2D09633' }, // 노랑
  { color: '#8FB9AA', light: '#8FB9AA33' }, // 민트
  { color: '#732C5A', light: '#732C5A33' }, // 보라2
  { color: '#100E40', light: '#732C5A33' }, // 진한 남색
  { color: '#383B73', light: '#383B7333' }, // 인디 파랑
  { color: '#D4522B', light: '#D4522B33' }, // 주황
  { color: '#1C9ACF', light: '#1C9ACF33' }, // 하늘
];

const ivory = '#abb2bf',
      white = "#ffffff",
      darkBackground = '#1e1f27',
      highlightBackground = 'rgba(0, 0, 0, 0.3)',
      background = '#282A35',
      tooltipBackground = '#353a42',
      selection = 'rgba(128, 203, 196, 0.2)',
      cursor = '#ffcc00';

const materialPalenightTheme = EditorView.theme(
  {
    '&': {
      height: "100%",
      color: white,
      backgroundColor: background
    },
    '.cm-content': { caretColor: cursor },
    '&.cm-focused .cm-cursor': { borderLeftColor: cursor },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: selection },
    '.cm-panels': { backgroundColor: darkBackground, color: white },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },
    '.cm-searchMatch': {
      backgroundColor: '#72a1ff59',
      outline: '1px solid #457dff'
    },
    '.cm-searchMatch.cm-searchMatch-selected': { backgroundColor: '#6199ff2f'},
    '.cm-activeLine': { backgroundColor: highlightBackground },
    '.cm-selectionMatch': { backgroundColor: '#aafe661a' },
    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      backgroundColor: '#bad0f847',
      outline: '1px solid #515a6b'
    },
    '.cm-ySelectionInfo': {
      paddingLeft: '3px',
      paddingRight: '3px',
      position: "absolute",
      top: "-1.25em",
      left: "-1px",
      fontSize: ".675em",
      fontFamily: "Pretendard",
      fontStyle: "normal",
      fontWeight: "bold",
      lineHeight: "normal",
      userSelect: "none",
      color: "white",
      zIndex: "99999999999999 !important",
      transition: "opacity .3s ease-in-out",
      backgroundColor: "inherit",
      borderRadius: "4px",
      opacity: "1",
      transitionDelay: "0s",
    },
    '.cm-gutters': {
      background: background,
      color: '#676e95',
      border: 'none'
    },
    '.cm-activeLineGutter': { backgroundColor: highlightBackground },
    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ddd'
    },
    '.cm-tooltip': {
      border: 'none',
      backgroundColor: tooltipBackground
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent'
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: tooltipBackground,
      borderBottomColor: tooltipBackground
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: highlightBackground,
        color: ivory
      }
    },
  },
  { dark: true }
);
const materialPalenightHighlightStyle = HighlightStyle.define([
  { tag: t.name, color: '#f3f3f3' },
  { tag: t.comment, color: '#6272a4' },
  { tag: t.string, color: '#f1fa8c' },
  { tag: t.atom, color: '#bd93f9' },
  { tag: t.meta, color: '#f8f8f2' },
  { tag: [t.keyword, t.operator, t.tagName], color: '#ff79c6' },
  { tag: [t.function(t.propertyName), t.propertyName], color: '#66d9ef' },
  { tag: [t.definition(t.variableName), t.function(t.variableName), t.className, t.attributeName], color: '#50fa7b' },
  { tag: t.atom, color: '#bd93f9' },
]);

export const CodePopup = ({ code, language, onClose }) => {
  const editorRef = useRef();
  
  useEffect(() => {
    let langMode = python();
    switch(language) {
      case 'JavaScript':
        langMode = javascript();
        break;
      case 'Python':
        langMode = python();
        break;
    }

    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        langMode,
        materialPalenightTheme,
        syntaxHighlighting(materialPalenightHighlightStyle),
        EditorView.contentAttributes.of({ contenteditable: false }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current
    });

    return () => {
      view.destroy();
    }  
  }, [code, language]);

  return (
    <div className={styles.codeBackground}>
      <div className={styles.codeBox}>
      <div className={styles.CodeMirrorPopup} ref={editorRef}></div>
        <div className={styles.btn} onClick={onClose}>닫기</div>
      </div>
    </div>
  )
};

export const CodeEditor = ({ doc, provider, gitId, selectedLang }) => {
  const editorRef = useRef();
  
  useEffect(() => {
    let userColor = usercolors[random.uint32() % usercolors.length];

    switch(gitId) {
      case 'park-hg':
        userColor = { color: '#F2D096', light: '#F2D09633' } // 노랑
        break;
      case 'Son0-0':
        userColor = { color: '#1C9ACF', light: '#1C9ACF33' } // 하늘
        break;
      case 'dd0114':
        userColor = { color: '#D4522B', light: '#D4522B33' } // 주황
        break;
      case 'EilLagerTodd':
        userColor = { color: '#ffbc42', light: '#ffbc4233' } // 핑크
        break;
      case 'annie1229':
        userColor = { color: '#7C46E0', light: '#7C46E033' } // 보라
        break;
    }

    let langMode = python();
    switch(selectedLang) {
      case 'JavaScript':
        langMode = javascript();
        break;
      case 'Python':
        langMode = python();
        break;
    }

    if(doc) {
      const ytext = doc.getText('codemirror');

      provider.awareness.setLocalStateField('user', {
        name: gitId,
        color: userColor.color,
        colorLight: userColor.light,
      });

      const state = EditorState.create({
        doc: ytext.toString(),
        extensions: [
          keymap.of([...yUndoManagerKeymap]),
          basicSetup,
          langMode,
          EditorView.lineWrapping,
          yCollab(ytext, provider.awareness),
          materialPalenightTheme,
          syntaxHighlighting(materialPalenightHighlightStyle)
        ],
      });

      const view = new EditorView({
        state,
        parent: editorRef.current
      });

      return () => {
        view.destroy();
      }  
    }

  }, [doc, provider, gitId, selectedLang]);

  return <div className={styles.CodeMirror} ref={editorRef}></div>
};