import PlainTextDisplay from '../../PlainTextDisplay';
import MarkdownDisplay from './MarkdownDisplay';
import { FreeTextFormItem, FormItemValueType } from '../../FormAdmin/FormItemUtils';

function parseURL(value: string) {
  try {
    return new URL(value);
  } catch (error) {
    try {
      return new URL(`http://${value}`);
    } catch (error2) {
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
    try {
      const url = parseURL(value);
      if (url) {
        return <a href={url.toString()}>{url.toString()}</a>;
      }
    } catch {
      // fall through to displaying as plain text
    }
  }

  return <PlainTextDisplay value={value} />;
}

export default FreeTextItemDisplay;
