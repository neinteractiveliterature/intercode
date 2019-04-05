import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';

import Form from '../Models/Form';
import FormBody from './Layouts/FormBody';

const SinglePageFormPresenter = forwardRef(
  (
    {
      form, children, convention, response, responseValuesChanged,
    },
    ref,
  ) => {
    const formItems = useMemo(() => form.getAllItems(), [form]);

    return (
      <>
        <FormBody
          convention={convention}
          ref={ref}
          formItems={formItems}
          errors={{}}
          response={response}
          responseValuesChanged={responseValuesChanged}
        />
        {children}
      </>
    );
  },
);

SinglePageFormPresenter.propTypes = {
  form: Form.propType.isRequired, // eslint-disable-line react/no-typos
  convention: PropTypes.shape({}).isRequired,
  response: PropTypes.shape({}).isRequired,
  responseValuesChanged: PropTypes.func.isRequired,
  children: PropTypes.node,
};

SinglePageFormPresenter.defaultProps = {
  children: null,
};

export default SinglePageFormPresenter;
