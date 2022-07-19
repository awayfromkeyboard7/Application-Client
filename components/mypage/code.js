import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { useEffect, useRef } from 'react';
import '../../styles/components/code/editor.module.css';
import styles from '../../styles/pages/mypage.module.scss';

const ivory = '#abb2bf',
  darkBackground = '#1e1f27',
  highlightBackground = 'rgba(0, 0, 0, 0.3)',
  background = '#282A35',
  tooltipBackground = '#353a42',
  selection = 'rgba(128, 203, 196, 0.2)',
  cursor = '#ffcc00';

const CodeEditor = ({ code, language }) => {
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

    const materialPalenightTheme = EditorView.theme(
        {
          '&': {
            height: "100%",
            color: '#ffffff',
            backgroundColor: background
          },
          'span': {
            // color: 'rgb(159, 70, 217)'
            color: 'rgb(255, 248, 118)'
          },
          '.ͼa': {
            color: '#C9414D'
          },
          '.ͼb': {
            color: '#EC7F37'
          },
          '.ͼc': {
            color: '#E7C335'
          },
          '.ͼd': {
            color: '#4FA757'
          },
          '.ͼf': {
            color: '#1C9ACF'
          },
          // done
          '.cm-content': {
            caretColor: cursor
          },
      
          // done
          '&.cm-focused .cm-cursor': {
            borderLeftColor: cursor
          },
      
          '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
            { backgroundColor: selection },
      
          '.cm-panels': { backgroundColor: darkBackground, color: '#ffffff' },
          '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
          '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },
      
          // done, use onedarktheme
          '.cm-searchMatch': {
            backgroundColor: '#72a1ff59',
            outline: '1px solid #457dff'
          },
          '.cm-searchMatch.cm-searchMatch-selected': {
            backgroundColor: '#6199ff2f'
          },
      
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
            background: '#282A35',
            color: '#676e95',
            border: 'none'
          },
      
          '.cm-activeLineGutter': {
            backgroundColor: highlightBackground
          },
      
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
          }
        },
        { dark: true }
    );

    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        langMode,
        keymap.of([indentWithTab]),
        materialPalenightTheme,
      ],
      readOnly: false,
    });
    EditorView.editable.of(false);

    const view = new EditorView({
      state,
      parent: editorRef.current
    });

    return () => {
      view.destroy();
    }  

  }, [code, language]);

  return <div className={styles.CodeMirror} ref={editorRef}></div>
};

export default CodeEditor;