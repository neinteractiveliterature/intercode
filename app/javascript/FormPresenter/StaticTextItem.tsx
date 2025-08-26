import { StaticTextFormItem } from '../FormAdmin/FormItemUtils';

export type StaticTextItemProps = {
  formItem: StaticTextFormItem;
};

export default function StaticTextItem({ formItem }: StaticTextItemProps): React.JSX.Element {
  switch (formItem.rendered_properties.style) {
    case 'subhead':
      return <div className="lead mb-3" dangerouslySetInnerHTML={{ __html: formItem.rendered_properties.content }} />;
    default:
      return <div dangerouslySetInnerHTML={{ __html: formItem.rendered_properties.content }} />;
  }
}
