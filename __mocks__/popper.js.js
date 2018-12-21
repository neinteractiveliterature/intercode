import PopperJs from 'popper.js';

// this avoids promise rejections because of Popper depending on createRange, which is not
// available in jsdom

export default class Popper {
  static placements = PopperJs.placements;

  constructor() {
    return {
      destroy: () => {},
      scheduleUpdate: () => {},
    };
  }
}
