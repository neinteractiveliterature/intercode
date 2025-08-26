import RequiredIndicator from './RequiredIndicator';
import { ParsedFormItem } from '../../FormAdmin/FormItemUtils';

export type CaptionLegendProps<PropertiesType extends { caption: string; required?: boolean }> = {
  formItem: ParsedFormItem<PropertiesType, unknown>;
};

function CaptionLegend<PropertiesType extends { caption: string; required?: boolean }>({
  formItem,
}: CaptionLegendProps<PropertiesType>): React.JSX.Element {
  return (
    <legend className="col-form-label">
      <span dangerouslySetInnerHTML={{ __html: formItem.rendered_properties.caption }} />
      <RequiredIndicator formItem={formItem} />
    </legend>
  );
}

export default CaptionLegend;
