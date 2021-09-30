// https://codereview.stackexchange.com/questions/153691/escape-user-input-for-use-in-js-regex
export default function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
