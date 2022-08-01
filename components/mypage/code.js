import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { useEffect, useRef } from 'react';
import '../../styles/components/code/editor.module.css';
import styles from '../../styles/pages/mypage.module.scss';

const ivory = '#abb2bf',
  chalky = "#e5c07b",
  coral = "#e06c75",
  cyan = "#56b6c2",
  invalid = "#ffffff",
  stone = "#7d8799", // Brightened compared to original to increase contrast
  malibu = "#61afef",
  sage = "#98c379",
  whiskey = "#d19a66",
  violet = "#c678dd",
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
          '.cm-content': {
            caretColor: cursor
          },
          '&.cm-focused .cm-cursor': {
            borderLeftColor: cursor
          },
          '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
            { backgroundColor: selection },
          '.cm-panels': { backgroundColor: darkBackground, color: '#ffffff' },
          '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
          '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },
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

    const materialPalenightHighlightStyle = HighlightStyle.define([
      // {tag: t.keyword,
      //  color: violet},
      // {tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
      //  color: coral},
      // {tag: [t.function(t.variableName), t.labelName],
      //  color: malibu},
      // {tag: [t.color, t.constant(t.name), t.standard(t.name)],
      //  color: whiskey},
      // {tag: [t.definition(t.name), t.separator],
      //  color: ivory},
      // {tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
      //  color: chalky},
      // {tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
      //  color: cyan},
      // {tag: [t.meta, t.comment],
      //  color: stone},
      // {tag: t.strong,
      //  fontWeight: "bold"},
      // {tag: t.emphasis,
      //  fontStyle: "italic"},
      // {tag: t.strikethrough,
      //  textDecoration: "line-through"},
      // {tag: t.link,
      //  color: stone,
      //  textDecoration: "underline"},
      // {tag: t.heading,
      //  fontWeight: "bold",
      //  color: coral},
      // {tag: [t.atom, t.bool, t.special(t.variableName)],
      //  color: whiskey },
      // {tag: [t.processingInstruction, t.string, t.inserted],
      //  color: sage},
      // {tag: t.invalid,
      //  color: invalid},
      { tag: t.comment, color: '#6272a4' },
      { tag: t.string, color: '#f1fa8c' },
      { tag: t.atom, color: '#bd93f9' },
      { tag: t.meta, color: '#f8f8f2' },
      { tag: [t.keyword, t.operator, t.tagName], color: '#ff79c6' },
      { tag: [t.function(t.propertyName), t.propertyName], color: '#66d9ef' },
      { tag: [t.definition(t.variableName), t.function(t.variableName), t.className, t.attributeName], color: '#50fa7b' },
      { tag: t.atom, color: '#bd93f9' },
    ]);

    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        langMode,
        keymap.of([indentWithTab]),
        materialPalenightTheme,
        syntaxHighlighting(materialPalenightHighlightStyle),
        EditorView.contentAttributes.of({ contenteditable: false }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
      defaultCharacterWidth: 10,
      defaultLineHeight: 30
    });

    return () => {
      view.destroy();
    }  

  }, [code, language]);

  return <div className={styles.CodeMirror} ref={editorRef}></div>
};

export default CodeEditor;