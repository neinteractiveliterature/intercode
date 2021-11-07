import { useCallback, useState, useMemo, ReactNode } from 'react';
import isEqual from 'lodash/isEqual';
import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import FormPresenterApp from '../FormPresenter';
import FormPresenter from '../FormPresenter/Layouts/FormPresenter';
import useAsyncFunction from '../useAsyncFunction';
import useAutocommitFormResponseOnChange from '../FormPresenter/useAutocommitFormResponseOnChange';
import deserializeFormResponse, { WithFormResponse } from '../Models/deserializeFormResponse';
import { useEventProposalQuery, EventProposalQueryData } from './queries.generated';
import { ConventionForFormItemDisplay } from '../FormPresenter/ItemDisplays/FormItemDisplay';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';
import { useUpdateEventProposalMutation, useSubmitEventProposalMutation } from './mutations.generated';
import { LoadQueryWithVariablesWrapper } from '../GraphqlLoadingWrappers';

function parseResponseErrors(error: ApolloError) {
  const { graphQLErrors } = error;
  if (!graphQLErrors) {
    return {};
  }
  const updateError = graphQLErrors.find((graphQLError) => isEqual(graphQLError.path, ['updateEventProposal']));
  const { validationErrors } = updateError?.extensions ?? {};
  return validationErrors;
}

type EventProposalFormInnerProps = {
  convention: ConventionForFormItemDisplay;
  initialEventProposal: WithFormResponse<EventProposalQueryData['convention']['event_proposal']>;
  form: CommonFormFieldsFragment;
  afterSubmit?: () => void;
  exitButton?: ReactNode;
};

function EventProposalFormInner({
  convention,
  initialEventProposal,
  form,
  afterSubmit,
  exitButton,
}: EventProposalFormInnerProps) {
  const { t } = useTranslation();
  const [updateMutate] = useUpdateEventProposalMutation();
  const [updateEventProposal, updateError, updateInProgress] = useAsyncFunction(updateMutate);
  const [updatePromise, setUpdatePromise] = useState<Promise<unknown>>();
  const [submitMutate] = useSubmitEventProposalMutation();
  const [submitEventProposal, submitError, submitInProgress] = useAsyncFunction(submitMutate);
  const [eventProposal, setEventProposal] = useState(initialEventProposal);
  const [responseErrors, setResponseErrors] = useState({});

  const responseValuesChanged = useCallback((newResponseValues) => {
    setEventProposal((prevEventProposal) => ({
      ...prevEventProposal,
      form_response_attrs: {
        ...prevEventProposal.form_response_attrs,
        ...newResponseValues,
      },
    }));
  }, []);

  const commitResponse = useCallback(
    async (proposal: typeof eventProposal) => {
      try {
        setResponseErrors({});
        const promise = updateEventProposal({
          variables: {
            input: {
              id: proposal.id,
              event_proposal: {
                form_response_attrs_json: JSON.stringify(proposal.form_response_attrs),
              },
            },
          },
        });
        setUpdatePromise(promise);
        await promise;
      } catch (e) {
        setResponseErrors(parseResponseErrors(e));
      } finally {
        setUpdatePromise(undefined);
      }
    },
    [updateEventProposal],
  );
  useAutocommitFormResponseOnChange(commitResponse, eventProposal);

  const submitResponse = useCallback(
    (proposal: typeof eventProposal) =>
      submitEventProposal({
        variables: {
          input: {
            id: proposal.id,
          },
        },
      }),
    [submitEventProposal],
  );

  const formSubmitted = useCallback(() => {
    if (afterSubmit) {
      afterSubmit();
    }
  }, [afterSubmit]);

  const submitForm = useCallback(async () => {
    if (updatePromise) {
      updatePromise.then(() => {
        submitForm();
      });
      return;
    }

    try {
      await submitResponse(eventProposal);
      formSubmitted();
    } catch (e) {
      setResponseErrors(parseResponseErrors(e));
    }
  }, [eventProposal, formSubmitted, submitResponse, updatePromise]);

  return (
    <FormPresenterApp form={form}>
      <div>
        <FormPresenter
          form={form}
          currentUserViewerRole={initialEventProposal.current_user_form_item_viewer_role}
          currentUserWriterRole={initialEventProposal.current_user_form_item_writer_role}
          convention={convention}
          response={eventProposal}
          responseErrors={responseErrors}
          isSubmittingResponse={submitInProgress}
          isUpdatingResponse={updateInProgress}
          responseValuesChanged={responseValuesChanged}
          submitForm={submitForm}
          exitButton={exitButton}
          submitButton={{ caption: t('eventProposals.edit.submitButton', 'Submit proposal') }}
          footerContent={
            <div className="text-end">
              <small className="text-muted">
                {t('forms.general.autocommitDisclosure', 'Your responses are automatically saved.')}
              </small>
            </div>
          }
        />
        <ErrorDisplay graphQLError={(updateError || submitError) as ApolloError | null} />
      </div>
    </FormPresenterApp>
  );
}

export type EventProposalFormProps = {
  eventProposalId: string;
  afterSubmit?: () => void;
  exitButton?: ReactNode;
};

export default LoadQueryWithVariablesWrapper(
  useEventProposalQuery,
  ({ eventProposalId }: EventProposalFormProps) => ({ eventProposalId }),
  function EventProposalForm({ data, afterSubmit, exitButton }): JSX.Element {
    const initialEventProposal = useMemo(
      () => deserializeFormResponse(data.convention.event_proposal),
      [data.convention.event_proposal],
    );

    const form = useMemo(
      () => data.convention.event_proposal.event_category.event_proposal_form,
      [data.convention.event_proposal.event_category.event_proposal_form],
    );

    if (!form) {
      return (
        <ErrorDisplay
          stringError={`Event category ${data.convention.event_proposal.event_category.name} has no proposal form`}
        />
      );
    }

    return (
      <EventProposalFormInner
        convention={data.convention}
        initialEventProposal={initialEventProposal}
        form={form}
        afterSubmit={afterSubmit}
        exitButton={exitButton}
      />
    );
  },
);
