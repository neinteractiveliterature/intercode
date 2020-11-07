import { StaticTextFormItem } from '../FormAdmin/FormItemUtils';

export type StaticTextItemProps = {
  formItem: StaticTextFormItem;
};

const StaticTextItem = ({ formItem }: StaticTextItemProps) => {
  switch (formItem.rendered_properties.style) {
    case 'subhead':
      return (
        <div
          className="lead mb-3"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: formItem.rendered_properties.content }}
        />
      );
    default:
      // eslint-disable-next-line react/no-danger
      return <div dangerouslySetInnerHTML={{ __html: formItem.rendered_properties.content }} />;
  }
};

export default StaticTextItem;
