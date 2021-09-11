import { EditorView } from '@codemirror/view';
import { tags, HighlightStyle } from '@codemirror/highlight';

const intercodeTheme = EditorView.theme({
  '&': {
    fontSize: '14.4px',
    fontFamily: 'var(--bs-font-monospace)',
    lineHeight: 'auto',
    background: 'transparent',
  },
  '.cm-scroller': {
    fontFamily: 'var(--bs-font-monospace)',
  },
});

export const intercodeHighlightStyle = HighlightStyle.define([
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.heading, color: 'var(--bs-blue)' },
  { tag: tags.quote, color: 'var(--bs-green)' },
  { tag: tags.keyword, color: 'var(--bs-purple)' },
  { tag: tags.atom, color: 'var(--bs-indigo)' },
  { tag: tags.number, color: 'var(--bs-teal)' },
  { tag: tags.definitionKeyword, color: 'var(--bs-blue)' },
  { tag: tags.variableName, color: 'var(--bs-indigo)' },
  { tag: tags.typeName, color: 'var(--bs-cyan)' },
  { tag: tags.comment, color: 'var(--bs-pink)' },
  { tag: tags.string, color: 'var(--bs-orange)' },
  { tag: tags.meta, color: 'var(--bs-teal)' },
  { tag: tags.modifier, color: '#6c757d', 'font-style': 'italic' },
  { tag: tags.bracket, color: 'var(--bs-green)' },
  { tag: tags.tagName, color: 'var(--bs-green)' },
  { tag: tags.propertyName, color: 'var(--bs-indigo)' },
  { tag: tags.link, color: 'var(--bs-blue)' },
  { tag: tags.invalid, backgroundColor: 'var(--bs-danger)' },
]);

export default intercodeTheme;
