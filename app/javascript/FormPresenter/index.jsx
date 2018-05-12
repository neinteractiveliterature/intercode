import React from 'react';
import PropTypes from 'prop-types';
import Form from '../Models/Form';
import SectionTraversalController from './SectionTraversalController';

const FormPresenterApp = ({ form, children }) => (
  <SectionTraversalController form={form}>
    {children}
  </SectionTraversalController>
);

FormPresenterApp.propTypes = {
  form: Form.propType.isRequired,
  children: PropTypes.node.isRequired,
};

export default FormPresenterApp;
