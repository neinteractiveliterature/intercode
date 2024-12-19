import { useCallback, useState, useMemo, ReactNode } from 'react';
import { ApolloError, useApolloClient, useSuspenseQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import FormPresenterApp from '../FormPresenter';
import FormPresenter from '../FormPresenter/Layouts/FormPresenter';
import useAutocommitFormResponseOnChange from '../FormPresenter/useAutocommitFormResponseOnChange';
import deserializeFormResponse, { WithFormResponse } from '../Models/deserializeFormResponse';
import { EventProposalQueryData, EventProposalQueryDocument } from './queries.generated';
import { ConventionForFormItemDisplay } from '../FormPresenter/ItemDisplays/FormItemDisplay';
import { CommonFormFieldsFragment } from '../Models/commonFormFragments.generated';
import { parseResponseErrors } from '../parseResponseErrors';
import { ImageAttachmentConfig } from '../BuiltInFormControls/MarkdownInput';
import type { Blob } from '@rails/activestorage';
import {
  AttachImageToEventProposalDocument,
  SubmitEventProposalDocument,
  UpdateEventProposalDocument,
} from './mutations.generated';

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
  const [updatePromise, setUpdatePromise] = useState<Promise<unknown>>();
  const [submitPromise, setSubmitPromise] = useState<Promise<unknown>>();
  const [eventProposal, setEventProposal] = useState(initialEventProposal);
  const [responseErrors, setResponseErrors] = useState({});
  const [submitError, setSubmitError] = useState<ApolloError>();
  const [updateError, setUpdateError] = useState<ApolloError>();
  const client = useApolloClient();

  const imageAttachmentConfig = useMemo<ImageAttachmentConfig>(
    () => ({
      addBlob: (blob: Blob) =>
        client.mutate({
          mutation: AttachImageToEventProposalDocument,
          variables: { id: eventProposal.id, signedBlobId: blob.signed_id },
        }),
      existingImages: eventProposal.images,
    }),
    [client, eventProposal.id, eventProposal.images],
  );

  const responseValuesChanged = useCallback(
    (newResponseValues: (typeof initialEventProposal)['form_response_attrs']) => {
      setEventProposal((prevEventProposal) => ({
        ...prevEventProposal,
        form_response_attrs: {
          ...prevEventProposal.form_response_attrs,
          ...newResponseValues,
        },
      }));
    },
    [],
  );

  const commitResponse = useCallback(
    async (proposal: typeof eventProposal) => {
      try {
        setResponseErrors({});
        const promise = client.mutate({
          mutation: UpdateEventProposalDocument,
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
        setUpdateError(e);
        setResponseErrors(parseResponseErrors(e, ['updateEventProposal']));
      } finally {
        setUpdatePromise(undefined);
      }
    },
    [client],
  );
  useAutocommitFormResponseOnChange(commitResponse, eventProposal);

  const submitResponse = useCallback(
    async (proposal: typeof eventProposal) => {
      try {
        const promise = client.mutate({
          mutation: SubmitEventProposalDocument,
          variables: {
            input: {
              id: proposal.id,
            },
          },
        });
        setSubmitPromise(promise);
        await promise;
      } catch (e) {
        setSubmitError(e);
      } finally {
        setSubmitPromise(undefined);
      }
    },
    [client],
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
      setResponseErrors(parseResponseErrors(e, ['updateEventProposal']));
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
          isSubmittingResponse={submitPromise != null}
          isUpdatingResponse={updatePromise != null}
          responseValuesChanged={responseValuesChanged}
          submitForm={submitForm}
          exitButton={exitButton}
          submitButton={{ caption: t('eventProposals.edit.submitButton') }}
          footerContent={
            <div className="text-end">
              <small className="text-muted">{t('forms.general.autocommitDisclosure')}</small>
            </div>
          }
          imageAttachmentConfig={imageAttachmentConfig}
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

export default function EventProposalForm({
  eventProposalId,
  afterSubmit,
  exitButton,
}: EventProposalFormProps): JSX.Element {
  const { data } = useSuspenseQuery(EventProposalQueryDocument, { variables: { eventProposalId } });
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
}
