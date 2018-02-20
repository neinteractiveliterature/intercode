import React from 'react';
import FormPresenterApp from '..';
import FormPresenterContainer from '../containers/FormPresenterContainer';
import RESTFormController from '../RESTFormController';

const MyProfileForm = props => (
  <RESTFormController
    {...props}
    autocommit="change"
    formSubmitted={() => {}}
    renderContent={formPresenterProps => (
      <FormPresenterApp form={formPresenterProps.form}>
        <FormPresenterContainer {...formPresenterProps} />
      </FormPresenterApp>
    )}
  />
);

export default MyProfileForm;
