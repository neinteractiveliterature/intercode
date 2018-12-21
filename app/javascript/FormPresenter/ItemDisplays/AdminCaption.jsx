import React from 'react';

import { FormItemPropType } from '../../Models/FormItem';

const AdminCaption = ({ formItem }) => {
  if (formItem.admin_description) {
    return <span>{formItem.admin_description}</span>;
  }

  if (formItem.properties && formItem.properties.caption) {
    // eslint-disable-next-line react/no-danger
    return <span dangerouslySetInnerHTML={{ __html: formItem.properties.caption }} />;
  }

  return <span>{formItem.identifier}</span>;
};

AdminCaption.propTypes = {
  formItem: FormItemPropType.isRequired,
};

export default AdminCaption;
