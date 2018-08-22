import React from 'react';

import FormItem from '../../Models/FormItem';

const AdminCaption = ({ formItem }) => {
  if (formItem.adminDescription) {
    return <span>{formItem.adminDescription}</span>;
  }

  if (formItem.properties && formItem.properties.caption) {
    // eslint-disable-next-line react/no-danger
    return <span dangerouslySetInnerHTML={{ __html: formItem.properties.caption }} />;
  }

  return <span>formItem.identifier</span>;
};

AdminCaption.propTypes = {
  formItem: FormItem.propType.isRequired,
};

export default AdminCaption;
