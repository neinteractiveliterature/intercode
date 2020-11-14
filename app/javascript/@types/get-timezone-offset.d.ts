declare module 'get-timezone-offset' {
  function getTimezoneOffset(tzStr: string, date: Date): number;

  export = getTimezoneOffset;
}
