import CodeMirror from 'codemirror';

// Adapted from https://github.com/CristinaSolana/codemirror-liquid-multiplex

const defineMultiplexingMode = (...modeNames) => (
  config => (
    CodeMirror.multiplexingMode(
      ...modeNames.map(modeName => CodeMirror.getMode(config, modeName)),
      {
        open: '{{',
        close: '}}',
        mode: CodeMirror.getMode(config, 'text/x-liquid'),
        delimStyle: 'liquid variable variable-2',
        innerStyle: 'liquid variable variable-2',
      },
      {
        open: '{%',
        close: '%}',
        mode: CodeMirror.getMode(config, 'text/x-liquid'),
        delimStyle: 'liquid variable-2 special keyword',
        innerStyle: 'liquid variable-2 special keyword',
      },
    )
  )
);

CodeMirror.defineMode('liquid-html', defineMultiplexingMode('text/html'));
CodeMirror.defineMode('liquid-markdown', defineMultiplexingMode('markdown'));
