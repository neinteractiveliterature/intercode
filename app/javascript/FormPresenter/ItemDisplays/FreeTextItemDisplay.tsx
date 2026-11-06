import PlainTextDisplay from '../../PlainTextDisplay';
import MarkdownDisplay from './MarkdownDisplay';
import { FreeTextFormItem, FormItemValueType } from '../../FormAdmin/FormItemUtils';

function parseURL(value: string) {
  try {
    return new URL(value);
  } catch {
    try {
      return new URL(`http://${value}`);
    } catch {
      return null;
    }
  }
}

export type FreeTextItemDisplayProps = {
  formItem: FreeTextFormItem;
  value: FormItemValueType<FreeTextFormItem>;
};

function FreeTextItemDisplay({ formItem, value }: FreeTextItemDisplayProps): React.JSX.Element {
  if (formItem.rendered_properties.format === 'markdown') {
    return <MarkdownDisplay renderedMarkdown={value} />;
  }

  if (formItem.rendered_properties.free_text_type === 'url') {
    let url: URL | null = null;
    try {
      url = parseURL(value);
    } catch {
      // fall through to displaying as plain text
    }
    if (url) {
      return <a href={url.toString()}>{url.toString()}</a>;
    }
  }

  return <PlainTextDisplay value={value} />;
}

export default FreeTextItemDisplay;
