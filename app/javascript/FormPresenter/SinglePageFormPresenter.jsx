import React from 'react';
import PropTypes from 'prop-types';
import Form from '../Models/Form';
import FormPresenterApp from '.';
import FormSectionContainer from './containers/FormSectionContainer';

const SinglePageFormPresenter = (props) => {
  const sectionContainers = props.form.getSections().map(section => (
    <FormSectionContainer
      key={section.id}
      convention={props.convention}
      form={props.form}
      section={section}
      errors={{}}
      response={props.response}
      responseValuesChanged={props.responseValuesChanged}
    />
  ));

  return (
    <FormPresenterApp form={props.form}>
      <div>
        {sectionContainers}
      </div>
    </FormPresenterApp>
  );
};

SinglePageFormPresenter.propTypes = {
  form: Form.propType.isRequired, // eslint-disable-line react/no-typos
  convention: PropTypes.shape({}).isRequired,
  response: PropTypes.shape({}).isRequired,
  responseValuesChanged: PropTypes.func.isRequired,
};

export default SinglePageFormPresenter;
