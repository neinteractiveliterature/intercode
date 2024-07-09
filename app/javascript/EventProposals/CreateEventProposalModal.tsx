import { useState, useMemo } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { useApolloClient } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay, sortByLocaleString } from '@neinteractiveliterature/litform';

import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import { ProposeEventButtonQueryData } from './queries.generated';
import { CreateEventProposalMutationData, useCreateEventProposalMutation } from './mutations.generated';

export type CreateEventProposalModalProps = {
  onCreate: (
    newEventProposal: NonNullable<CreateEventProposalMutationData['createEventProposal']>['event_proposal'],
  ) => void;
  cancel: () => void;
  visible: boolean;
  userEventProposals: NonNullable<
    NonNullable<ProposeEventButtonQueryData['convention']['my_profile']>['user']
  >['event_proposals'];
  proposableEventCategories: ProposeEventButtonQueryData['convention']['event_categories'];
  departments: ProposeEventButtonQueryData['convention']['departments'];
};

function CreateEventProposalModal({
  onCreate,
  cancel,
  visible,
  userEventProposals,
  proposableEventCategories,
  departments,
}: CreateEventProposalModalProps): JSX.Element {
  const { t } = useTranslation();
  const [cloneEventProposal, setCloneEventProposal] = useState<(typeof userEventProposals)[0]>();
  const topLevelEventCategories = useMemo(
    () => proposableEventCategories.filter((category) => !category.department),
    [proposableEventCategories],
  );
  const topLevelEntities = useMemo(
    () => sortByLocaleString([...topLevelEventCategories, ...departments], (entity) => entity.name),
    [departments, topLevelEventCategories],
  );
  const [department, setDepartment] = useState(topLevelEntities.length > 1 ? undefined : departments[0]);
  const [eventCategory, setEventCategory] = useState(() =>
    department && department.event_categories.length === 1
      ? proposableEventCategories.find((category) => category.id === department.event_categories[0].id)
      : undefined,
  );
  const [createProposal, { loading: createInProgress, error: createError }] = useCreateEventProposalMutation();
  const apolloClient = useApolloClient();

  const departmentEventCategories = useMemo(
    () =>
      department
        ? sortByLocaleString(
            proposableEventCategories.filter(
              (category) => category.department && category.department.id === department.id,
            ),
            (category) => category.name,
          )
        : [],
    [department, proposableEventCategories],
  );

  const createClicked = async () => {
    if (!eventCategory) {
      return;
    }
    const { data } = await createProposal({
      variables: {
        cloneEventProposalId: cloneEventProposal?.id.toString(),
        eventCategoryId: eventCategory.id.toString(),
      },
    });

    if (data) {
      await apolloClient.clearStore();
      onCreate(data.createEventProposal.event_proposal);
    }
  };

  return (
    <Modal visible={visible} dialogClassName="modal-lg" className="text-body">
      <div className="modal-header">{t('eventProposals.newProposalModal.title')}</div>
      <div className="modal-body text-start">
        <SelectWithLabel
          label={t('eventProposals.newProposalModal.categoryLabel')}
          options={topLevelEntities}
          isClearable={topLevelEntities.length > 1}
          isDisabled={createInProgress}
          value={department || (eventCategory && eventCategory.department == null ? eventCategory : null)}
          getOptionValue={(option) => `${option.__typename}:${option.id}`}
          getOptionLabel={(option) => option.name}
          onChange={(entity: (typeof topLevelEntities)[0]) => {
            if (!entity) {
              setDepartment(undefined);
              setEventCategory(undefined);
            } else if (entity.__typename === 'Department') {
              setDepartment(entity);
              setEventCategory(undefined);
            } else if (entity.__typename === 'EventCategory') {
              setDepartment(undefined);
              setEventCategory(entity);
            }
          }}
        />

        {department && (
          <>
            {department.proposal_description && (
              <div className="alert alert-info">{department.proposal_description}</div>
            )}

            <SelectWithLabel
              label={t('eventProposals.newProposalModal.subcategoryLabel', { departmentName: department.name })}
              options={departmentEventCategories}
              isClearable
              isDisabled={createInProgress}
              value={eventCategory}
              getOptionValue={(option) => option.id.toString()}
              getOptionLabel={(option) => option.name}
              onChange={(category: (typeof departmentEventCategories)[0]) => {
                setEventCategory(category);
              }}
            />
          </>
        )}

        {eventCategory && eventCategory.proposal_description && (
          <div className="alert alert-info">{eventCategory.proposal_description}</div>
        )}

        <hr />

        <SelectWithLabel
          label={t(
            'eventProposals.newProposalModal.cloneProposalLabel',
            `If you'd like to propose an event you've proposed sometime in the past,
            please select it here to have its information copied into the proposal form.
            Otherwise, leave this field blank.`,
          )}
          options={(userEventProposals || [])
            .filter((eventProposal) => eventProposal.status !== 'draft')
            .filter(
              (eventProposal) =>
                eventCategory && eventProposal.event_category.name.toLowerCase() === eventCategory.name.toLowerCase(),
            )}
          isClearable
          isDisabled={createInProgress}
          value={cloneEventProposal}
          getOptionValue={(option) => option.id.toString()}
          getOptionLabel={(option) => `${option.title} (${option.event_category.name}, ${option.convention.name})`}
          onChange={(proposal: (typeof userEventProposals)[0]) => {
            setCloneEventProposal(proposal);
          }}
        />

        {cloneEventProposal &&
        eventCategory &&
        cloneEventProposal.event_category.name.toLowerCase() !== eventCategory.name.toLowerCase() ? (
          <div className="mt-4 alert alert-warning">
            {t(
              'eventProposals.newProposalModal.cloneFromDifferentCategoryWarning',
              `You are proposing a {{ newCategoryName }}, but copying information
                  from {{ cloneProposalTitle }}, which is a {{ cloneProposalCategoryName }}.
                  Make sure this is what you want before continuing.  You will not be able to change
                  the category of your new event once you have started the proposal.`,
              {
                newCategoryName: eventCategory.name,
                cloneProposalTitle: cloneEventProposal.title,
                cloneProposalCategoryName: cloneEventProposal.event_category.name,
              },
            )}
          </div>
        ) : null}

        <ErrorDisplay graphQLError={createError} />
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" type="button" disabled={createInProgress} onClick={cancel}>
          {t('buttons.cancel')}
        </button>
        <button
          className="btn btn-primary"
          type="button"
          disabled={!eventCategory || createInProgress}
          onClick={createClicked}
        >
          {t('eventProposals.newProposalModal.createProposalButton')}
        </button>
      </div>
    </Modal>
  );
}

export default CreateEventProposalModal;
