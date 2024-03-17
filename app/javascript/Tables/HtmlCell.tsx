export default function HtmlCell({ value }: { value: string | undefined | null }) {
  return <div dangerouslySetInnerHTML={{ __html: value ?? '' }} />;
}
