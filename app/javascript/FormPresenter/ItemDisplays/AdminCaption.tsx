export type AdminCaptionProps = {
  formItem: {
    admin_description?: string | null;
    identifier?: string | null;
    rendered_properties?:
      | null
      | {}
      | {
          caption: string;
        };
  };
};

function propertiesHasCaption(
  properties?: null | {} | { caption: string },
): properties is { caption: string } {
  return Object.prototype.hasOwnProperty.call(properties, 'caption');
}

function AdminCaption({ formItem }: AdminCaptionProps) {
  if (formItem.admin_description) {
    return <span>{formItem.admin_description}</span>;
  }

  if (propertiesHasCaption(formItem.rendered_properties)) {
    // eslint-disable-next-line react/no-danger
    return <span dangerouslySetInnerHTML={{ __html: formItem.rendered_properties.caption }} />;
  }

  return <span>{formItem.identifier}</span>;
}

export default AdminCaption;
