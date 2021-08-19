import { useCallback, useState, useMemo, ReactNode } from 'react';
import isEqual from 'lodash/isEqual';
import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay, PageLoadingIndicator } from '@neinteractiveliterature/litform';

import FormPresenterApp from '../FormPresenter';
import FormPresenter from '../FormPresenter/Layouts/FormPresenter';
import useAsyncFunction from '../useAsyncFunction';
import useAutocommitFormResponseOnChange from '../FormPresenter/useAutocommitFormResponseOnChange';
import deserializeFormResponse, { WithFormResponse } from '../Models/deserializeFormResponse';
import { useEventProposalQuery, EventProposalQueryData } from './queries.generated';
import { ConventionForFormItemDisplay } from '../FormPresenter/ItemDisplays/FormItemDisplay';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';
import {
  useUpdateEventProposalMutation,
  useSubmitEventProposalMutation,
} from './mutations.generated';

function parseResponseErrors(error: ApolloError) {
  const { graphQLErrors } = error;
  if (!graphQLErrors) {
    return {};
  }
  const updateError = graphQLErrors.find((graphQLError) =>
    isEqual(graphQLError.path, ['updateEventProposal']),
  );
  const { validationErrors } = updateError?.extensions ?? {};
  return validationErrors;
}

type EventProposalFormInnerProps = {
  convention: ConventionForFormItemDisplay;
  initialEventProposal: WithFormResponse<EventProposalQueryData['eventProposal']>;
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
  const [updatePromise, setUpdatePromise] = useState<Promise<any>>();
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
          currentUserRole={initialEventProposal.current_user_form_item_role}
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
  eventProposalId: number;
  afterSubmit?: () => void;
  exitButton?: ReactNode;
};

function EventProposalForm({ eventProposalId, afterSubmit, exitButton }: EventProposalFormProps) {
  const { data, loading, error } = useEventProposalQuery({ variables: { eventProposalId } });

  const initialEventProposal = useMemo(
    () => (loading || error ? undefined : deserializeFormResponse(data!.eventProposal)),
    [loading, error, data],
  );

  const form = useMemo(
    () => (loading || error ? undefined : data!.eventProposal.event_category.event_proposal_form),
    [loading, error, data],
  );

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <EventProposalFormInner
      convention={data!.convention!}
      initialEventProposal={initialEventProposal!}
      form={form!}
      afterSubmit={afterSubmit}
      exitButton={exitButton}
    />
  );
}

export default EventProposalForm;
