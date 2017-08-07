import React from 'react';
import PropTypes from 'prop-types';

function renderSectionList(form) {
  return form.getSections().map(section => (
    <section key={section.id}>
      {section.title}
    </section>
  ));
}

const FormEditor = ({ form }) => {
  if (!form) {
    return <div />;
  }

  return <div>{renderSectionList(form)}</div>;
};

FormEditor.propTypes = {
  form: PropTypes.shape({
    properties: PropTypes.object.isRequired,
    formSections: PropTypes.object.isRequired,
    formItems: PropTypes.object.isRequired,
  }),
};

export default FormEditor;
