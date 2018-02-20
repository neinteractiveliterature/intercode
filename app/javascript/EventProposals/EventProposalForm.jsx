import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { isEqual } from 'lodash';
import ErrorDisplay from '../ErrorDisplay';
import FormController from '../FormPresenter/FormController';
import FormPresenterApp from '../FormPresenter';
import FormPresenterContainer from '../FormPresenter/containers/FormPresenterContainer';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import { deserializeForm, deserializeFormResponseModel } from '../FormPresenter/GraphQLFormDeserialization';
import { eventProposalQuery } from './queries';
import { updateEventProposalMutation, submitEventProposalMutation } from './mutations';

function parseResponseErrors(error) {
  const { graphQLErrors } = error;
  const updateError = graphQLErrors.find(graphQLError => isEqual(graphQLError.path, ['updateEventProposal']));
  const { validationErrors } = (updateError || {});
  return validationErrors;
}

@compose(
  graphql(eventProposalQuery),
  graphql(updateEventProposalMutation, {
    props: ({ mutate }) => ({
      updateEventProposal: eventProposal => mutate({
        variables: {
          input: {
            id: eventProposal.id,
            event_proposal: {
              form_response_attrs_json: JSON.stringify(eventProposal.formResponseAttrs),
            },
          },
        },
      }),
    }),
  }),
  graphql(submitEventProposalMutation, {
    props: ({ mutate }) => ({
      submitEventProposal: eventProposal => mutate({
        variables: {
          input: {
            id: eventProposal.id,
          },
        },
      }),
    }),
  }),
)
@GraphQLQueryResultWrapper
class EventProposalForm extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(eventProposalQuery).isRequired,
    updateEventProposal: PropTypes.func.isRequired,
    submitEventProposal: PropTypes.func.isRequired,
    afterSubmitUrl: PropTypes.string.isRequired,
    exitButton: PropTypes.shape({
      caption: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  };

  static defaultProps = {
    exitButton: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      eventProposal: deserializeFormResponseModel(props.data.eventProposal),
      convention: props.data.convention,
      form: deserializeForm(props.data.convention.event_proposal_form),
    };
  }

  responseValuesChanged = (newResponseValues, callback) => {
    this.setState({
      eventProposal: {
        ...this.state.eventProposal,
        formResponseAttrs: {
          ...this.state.eventProposal.formResponseAttrs,
          ...newResponseValues,
        },
      },
    }, callback);
  }

  updateEventProposal = () => this.props.updateEventProposal(this.state.eventProposal)
  submitEventProposal = () => this.props.submitEventProposal(this.state.eventProposal)

  formSubmitted = () => {
    window.location.href = this.props.afterSubmitUrl;
  }

  render = () => (
    <FormController
      form={this.state.form}
      convention={this.state.convention}
      response={this.state.eventProposal.formResponseAttrs}
      responseValuesChanged={this.responseValuesChanged}
      updateResponse={this.updateEventProposal}
      parseResponseErrors={parseResponseErrors}
      submitForm={this.submitEventProposal}
      formSubmitted={this.formSubmitted}
      autocommit="change"

      renderContent={({ error, ...formPresenterProps }) => (
        <FormPresenterApp form={this.state.form}>
          <div>
            <FormPresenterContainer
              {...formPresenterProps}
              exitButton={this.props.exitButton}
              submitButton={{ caption: 'Submit proposal' }}
              footerContent={(
                <div className="text-right">
                  <small className="text-muted">Your responses are automatically saved.</small>
                </div>
              )}
            />
            <ErrorDisplay graphQLError={error} />
          </div>
        </FormPresenterApp>
      )}
    />
  )
}

export default EventProposalForm;
