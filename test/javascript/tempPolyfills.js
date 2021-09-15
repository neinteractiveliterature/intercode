/* eslint-disable class-methods-use-this */
global.requestAnimationFrame = (cb) => {
  setTimeout(cb, 0);
};

export default global.requestAnimationFrame;
