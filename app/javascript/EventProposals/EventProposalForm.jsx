import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { flowRight, isEqual } from 'lodash';
import ErrorDisplay from '../ErrorDisplay';
import FormController from '../FormPresenter/FormController';
import FormPresenterApp from '../FormPresenter';
import FormPresenter from '../FormPresenter/Layouts/FormPresenter';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';
import { deserializeForm, deserializeFormResponseModel } from '../FormPresenter/GraphQLFormDeserialization';
import { EventProposalQuery } from './queries.gql';
import { UpdateEventProposal, SubmitEventProposal } from './mutations.gql';

function parseResponseErrors(error) {
  const { graphQLErrors } = error;
  const updateError = graphQLErrors.find(graphQLError => isEqual(graphQLError.path, ['updateEventProposal']));
  const { validationErrors } = (updateError || {});
  return validationErrors;
}

@flowRight([
  graphql(EventProposalQuery),
  graphql(UpdateEventProposal, {
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
  graphql(SubmitEventProposal, {
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
])
@GraphQLQueryResultWrapper
class EventProposalForm extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(EventProposalQuery).isRequired,
    updateEventProposal: PropTypes.func.isRequired,
    submitEventProposal: PropTypes.func.isRequired,
    afterSubmitUrl: PropTypes.string,
    afterSubmit: PropTypes.func,
    exitButton: PropTypes.oneOfType([
      PropTypes.shape({
        caption: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
      PropTypes.node,
    ]),
  };

  static defaultProps = {
    afterSubmit: null,
    afterSubmitUrl: null,
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
    this.setState(prevState => ({
      eventProposal: {
        ...prevState.eventProposal,
        formResponseAttrs: {
          ...prevState.eventProposal.formResponseAttrs,
          ...newResponseValues,
        },
      },
    }), callback);
  }

  updateEventProposal = () => this.props.updateEventProposal(this.state.eventProposal)

  submitEventProposal = () => this.props.submitEventProposal(this.state.eventProposal)

  formSubmitted = () => {
    if (this.props.afterSubmitUrl) {
      window.location.href = this.props.afterSubmitUrl;
    } else if (this.props.afterSubmit) {
      this.props.afterSubmit();
    }
  }

  renderExitButton = () => {
    if (!this.props.exitButton) {
      return null;
    }

    if (this.props.exitButton.caption && this.props.exitButton.url) {
      return (
        <a
          className="btn btn-outline-secondary mr-2"
          href={this.props.exitButton.url}
        >
          {this.props.exitButton.caption}
        </a>
      );
    }

    return this.props.exitButton;
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
            <FormPresenter
              {...formPresenterProps}
              exitButton={this.renderExitButton()}
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
