import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import Form from '../../Models/Form';
import FormBody from './FormBody';

const FormSection = forwardRef(
  ({ form, section, ...props }, ref) => {
    const items = form.getItemsInSection(section.id);

    return <FormBody ref={ref} formItems={items} {...props} />;
  },
);

FormSection.propTypes = {
  form: Form.propType.isRequired,
  section: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default FormSection;
