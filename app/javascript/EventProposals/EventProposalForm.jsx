import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash-es/isEqual';
import { useMutation } from 'react-apollo-hooks';

import { deserializeForm, deserializeFormResponseModel } from '../FormPresenter/GraphQLFormDeserialization';
import ErrorDisplay from '../ErrorDisplay';
import { EventProposalQuery } from './queries.gql';
import FormPresenterApp from '../FormPresenter';
import FormPresenter from '../FormPresenter/Layouts/FormPresenter';
import { UpdateEventProposal, SubmitEventProposal } from './mutations.gql';
import useAsyncFunction from '../useAsyncFunction';
import useQuerySuspended from '../useQuerySuspended';
import useAutocommitFormResponseOnChange from '../FormPresenter/useAutocommitFormResponseOnChange';

function parseResponseErrors(error) {
  const { graphQLErrors } = error;
  if (!graphQLErrors) {
    return {};
  }
  const updateError = graphQLErrors.find((graphQLError) => isEqual(graphQLError.path, ['updateEventProposal']));
  const { validationErrors } = ((updateError || {}).extensions || {});
  return validationErrors;
}

function ExitButton({ exitButton }) {
  if (!exitButton) {
    return null;
  }

  if (exitButton.caption && exitButton.url) {
    return (
      <a
        className="btn btn-outline-secondary mr-2"
        href={exitButton.url}
      >
        {exitButton.caption}
      </a>
    );
  }

  return exitButton;
}

ExitButton.propTypes = {
  exitButton: PropTypes.shape({
    url: PropTypes.string,
    caption: PropTypes.string,
  }),
};

ExitButton.defaultProps = {
  exitButton: null,
};

function EventProposalForm({
  eventProposalId, afterSubmit, exitButton,
}) {
  const { data, error } = useQuerySuspended(EventProposalQuery, { variables: { eventProposalId } });
  const [updateMutate] = useMutation(UpdateEventProposal);
  const [updateEventProposal, updateError, updateInProgress] = useAsyncFunction(updateMutate);
  const [updatePromise, setUpdatePromise] = useState(null);
  const [submitMutate] = useMutation(SubmitEventProposal);
  const [submitEventProposal, submitError, submitInProgress] = useAsyncFunction(submitMutate);

  const { convention } = data;
  const [eventProposal, setEventProposal] = useState(
    deserializeFormResponseModel(data.eventProposal),
  );
  const [responseErrors, setResponseErrors] = useState({});
  const form = deserializeForm(data.eventProposal.event_category.event_proposal_form);

  const responseValuesChanged = useCallback(
    (newResponseValues) => {
      setEventProposal((prevEventProposal) => ({
        ...prevEventProposal,
        formResponseAttrs: {
          ...prevEventProposal.formResponseAttrs,
          ...newResponseValues,
        },
      }));
    },
    [],
  );

  const commitResponse = useCallback(
    async (proposal) => {
      try {
        const promise = updateEventProposal({
          variables: {
            input: {
              id: proposal.id,
              event_proposal: {
                form_response_attrs_json: JSON.stringify(proposal.formResponseAttrs),
              },
            },
          },
        });
        setUpdatePromise(promise);
        await promise;
      } catch (e) {
        setResponseErrors(parseResponseErrors(e));
      } finally {
        setUpdatePromise(null);
      }
    },
    [updateEventProposal],
  );
  useAutocommitFormResponseOnChange(commitResponse, eventProposal);

  const submitResponse = useCallback(
    (proposal) => submitEventProposal({
      variables: {
        input: {
          id: proposal.id,
        },
      },
    }),
    [submitEventProposal],
  );

  const formSubmitted = useCallback(
    () => {
      if (afterSubmit) {
        afterSubmit();
      }
    },
    [afterSubmit],
  );

  const submitForm = useCallback(
    async () => {
      if (updatePromise) {
        updatePromise.then(() => { submitForm(); });
        return;
      }

      try {
        await submitResponse(eventProposal);
        formSubmitted();
      } catch (e) {
        setResponseErrors(parseResponseErrors(e));
      }
    },
    [eventProposal, formSubmitted, submitResponse, updatePromise],
  );

  const formPresenterProps = {
    form,
    convention,
    response: eventProposal.formResponseAttrs,
    responseErrors,
    error,
    isSubmittingResponse: submitInProgress,
    isUpdatingResponse: updateInProgress,
    responseValuesChanged,
    submitForm,
  };

  return (
    <FormPresenterApp form={form}>
      <div>
        <FormPresenter
          {...formPresenterProps}
          exitButton={<ExitButton exitButton={exitButton} />}
          submitButton={{ caption: 'Submit proposal' }}
          footerContent={(
            <div className="text-right">
              <small className="text-muted">Your responses are automatically saved.</small>
            </div>
          )}
        />
        <ErrorDisplay graphQLError={updateError || submitError} />
      </div>
    </FormPresenterApp>
  );
}

EventProposalForm.propTypes = {
  eventProposalId: PropTypes.number.isRequired,
  afterSubmit: PropTypes.func,
  exitButton: PropTypes.shape({}),
};

EventProposalForm.defaultProps = {
  afterSubmit: null,
  exitButton: null,
};

export default EventProposalForm;
