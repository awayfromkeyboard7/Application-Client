import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next';
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { keymap, ViewUpdate } from '@codemirror/view';
import { python } from '@codemirror/lang-python'
import { indentWithTab } from '@codemirror/commands';
import { useEffect, useRef } from 'react';
import * as random from 'lib0/random';
import '../../styles/components/code/editor.module.css';
import styles from '../../styles/pages/Code.module.scss';

export const usercolors = [
  { color: '#30bced', light: '#30bced33' },
  { color: '#6eeb83', light: '#6eeb8333' },
  { color: '#ffbc42', light: '#ffbc4233' },
  { color: '#ecd444', light: '#ecd44433' },
  { color: '#ee6352', light: '#ee635233' },
  { color: '#9ac2c9', light: '#9ac2c933' },
  { color: '#8acb88', light: '#8acb8833' },
  { color: '#1be7ff', light: '#1be7ff33' },
];

const ivory = '#abb2bf',
  stone = '#7d8799', // Brightened compared to original to increase contrast
  invalid = '#ffffff',
  darkBackground = '#1e1f27',
  highlightBackground = 'rgba(0, 0, 0, 0.3)',
  background = '#282A35',
  tooltipBackground = '#353a42',
  selection = 'rgba(128, 203, 196, 0.2)',
  cursor = '#ffcc00';

export const userColor = usercolors[random.uint32() % usercolors.length];

const CodeEditor = ({ doc, provider, gitId }) => {
  const editorRef = useRef();

  useEffect(() => {
    if(doc) {
      const ytext = doc.getText('codemirror');
      const codeUserColor = provider.awareness.getLocalState('color');
      provider.awareness.setLocalStateField('user', {
        name: gitId,
        color: codeUserColor.color,
        colorLight: codeUserColor.light,
      });

      const materialPalenightTheme = EditorView.theme(
        {
          // done
          '&': {
            height: "100%",
            color: '#ffffff',
            backgroundColor: background
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
            padding: '4px',
            position: "absolute",
            top: "-2em",
            left: "-1px",
            fontSize: ".75em",
            fontFamily: "Pretendard",
            fontStyle: "normal",
            fontWeight: "bold",
            lineHeight: "normal",
            userSelect: "none",
            color: "white",
            zIndex: "99999 !important",
            transition: "opacity .3s ease-in-out",
            backgroundColor: "inherit",
            borderRadius: "4px",
            opacity: "1",
            transitionDelay: "0s",
          },
      
          // done
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
        doc: ytext.toString(),
        extensions: [
          keymap.of([...yUndoManagerKeymap]),
          basicSetup,
          python(),
          keymap.of([indentWithTab]),
          yCollab(ytext, provider.awareness),
          materialPalenightTheme,
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

  }, [doc, provider, gitId]);

  return <div className={styles.CodeMirror} ref={editorRef}></div>

};

export default CodeEditor;