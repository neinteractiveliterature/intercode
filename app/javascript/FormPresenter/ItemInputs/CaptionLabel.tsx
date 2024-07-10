import RequiredIndicator from './RequiredIndicator';
import { ParsedFormItem } from '../../FormAdmin/FormItemUtils';

export type CaptionLabelProps<PropertiesType extends { caption: string; required?: boolean }> = {
  formItem: ParsedFormItem<PropertiesType, unknown>;
  htmlFor: string;
};

function CaptionLabel<PropertiesType extends { caption: string; required?: boolean }>({
  formItem,
  htmlFor,
}: CaptionLabelProps<PropertiesType>): JSX.Element {
  return (
    <label
      className="form-label form-item-label"
      htmlFor={htmlFor}
      aria-label={formItem.rendered_properties.caption}
      aria-required={formItem.rendered_properties.required ?? false}
    >
      <span dangerouslySetInnerHTML={{ __html: formItem.rendered_properties.caption }} />
      <RequiredIndicator formItem={formItem} />
    </label>
  );
}

export default CaptionLabel;
