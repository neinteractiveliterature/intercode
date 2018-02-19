import React from 'react';
import PropTypes from 'prop-types';
import FormPresenterApp from '..';
import FormPresenterContainer from '../containers/FormPresenterContainer';
import RESTFormController from '../RESTFormController';

const EventProposalForm = (props) => {
  const {
    afterSubmitUrl,
    ...restProps
  } = props;

  return (
    <RESTFormController
      {...restProps}
      autocommit="change"
      formSubmitted={() => { window.location.href = afterSubmitUrl; }}
      renderContent={formPresenterProps => (
        <FormPresenterApp form={formPresenterProps.form}>
          <FormPresenterContainer
            {...formPresenterProps}
            submitButton={{ caption: 'Submit proposal' }}
            footerContent={(
              <div className="text-right">
                <small className="text-muted">Your responses are automatically saved.</small>
              </div>
            )}
          />
        </FormPresenterApp>
      )}
    />
  );
};

EventProposalForm.propTypes = {
  afterSubmitUrl: PropTypes.string.isRequired,
};

export default EventProposalForm;
