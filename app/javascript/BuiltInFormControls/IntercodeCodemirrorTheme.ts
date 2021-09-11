import { EditorView } from '@codemirror/view';

const intercodeTheme = EditorView.theme({
  '&': {
    fontSize: '14.4px',
    fontFamily: 'var(--bs-font-monospace)',
    lineHeight: 'auto',
    background: 'transparent',
  },
  '.cm-header': {
    color: 'var(--bs-blue)',
  },
  '.cm-quote': {
    color: 'var(--bs-green)',
  },

  '.cm-keyword': {
    color: 'var(--bs-purple)',
  },
  '.cm-atom': {
    color: 'var(--bs-indigo)',
  },
  '.cm-number': {
    color: 'var(--bs-teal)',
  },
  '.cm-def': {
    color: 'var(--bs-blue)',
  },
  '.cm-variable-2': {
    color: 'var(--bs-indigo)',
  },
  '.cm-variable-3, .cm-type': {
    color: 'var(--bs-cyan)',
  },
  '.cm-comment': {
    color: 'var(--bs-pink)',
  },
  '.cm-string': {
    color: 'var(--bs-orange)',
  },
  '.cm-string-2': {
    color: 'var(--bs-orange)',
  },
  '.cm-meta': {
    color: '#adb5bd',
  },
  '.cm-qualifier': {
    color: '#6c757d',
    'font-style': 'italic',
  },
  '.cm-builtin': {
    color: 'var(--bs-indigo)',
  },
  '.cm-bracket': {
    color: 'var(--bs-yellow)',
  },
  '.cm-tag': {
    color: 'var(--bs-green)',
  },
  '.cm-attribute': {
    color: 'var(--bs-cyan)',
  },
  '.cm-hr': {
    color: '#495057',
  },
  '.cm-link': {
    color: 'var(--bs-blue)',
  },

  '.cm-error': {
    color: 'var(--bs-red)',
  },

  '.cm-liquid': {
    'background-color': '#e9ecef',
  },
});

export default intercodeTheme;
