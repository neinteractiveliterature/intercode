/* eslint-disable class-methods-use-this */
global.requestAnimationFrame = (cb) => {
  setTimeout(cb, 0);
};

// just to make @juggle/resize-observer's observe() method not error out
class MutationObserver {
  observe() {}

  disconnect() {}
}
global.MutationObserver = MutationObserver;

/**
 * begin codemirror polyfills
 * https://stackoverflow.com/questions/42213522/mocking-document-createrange-for-jest
 */

global.Range = function Range() {};

const createContextualFragment = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.children[0]; // so hokey it's not even funny
};

Range.prototype.createContextualFragment = (html) => createContextualFragment(html);

global.window.document.createRange = function createRange() {
  return {
    setEnd: () => {},
    setStart: () => {},
    getBoundingClientRect: () => ({ right: 0 }),
    getClientRects: () => [],
    createContextualFragment,
  };
};

/* end codemirror polyfills */

export default global.requestAnimationFrame;
