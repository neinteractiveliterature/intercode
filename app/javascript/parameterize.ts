export default function parameterize(str: string): string {
  return str.replace(/[^A-Za-z0-9-]/g, '-');
}
