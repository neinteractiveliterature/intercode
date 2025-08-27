import { ParsedFormItem } from '../../FormAdmin/FormItemUtils';

export type RequiredIndicatorProps<PropertiesType extends { required?: boolean }> = {
  formItem: ParsedFormItem<PropertiesType, unknown>;
};

export default function RequiredIndicator<PropertiesType extends { required?: boolean }>({
  formItem,
}: RequiredIndicatorProps<PropertiesType>): React.JSX.Element {
  if (formItem.rendered_properties.required) {
    return (
      <span className="text-danger ms-1" aria-label="Required">
        *
      </span>
    );
  }

  return <span />;
}
