import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { useApolloClient, useMutation } from '@apollo/react-hooks';

import { CreateEventProposal } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import useAsyncFunction from '../useAsyncFunction';
import { sortByLocaleString } from '../ValueUtils';

function CreateEventProposalModal({
  onCreate, cancel, visible, userEventProposals, proposableEventCategories, departments,
}) {
  const [cloneEventProposal, setCloneEventProposal] = useState(null);
  const topLevelEventCategories = useMemo(
    () => proposableEventCategories.filter((category) => !category.department),
    [proposableEventCategories],
  );
  const topLevelEntities = useMemo(
    () => sortByLocaleString([...topLevelEventCategories, ...departments], (entity) => entity.name),
    [departments, topLevelEventCategories],
  );
  const [department, setDepartment] = useState(
    topLevelEntities.length > 1 ? null : departments[0],
  );
  const [eventCategory, setEventCategory] = useState(() => (
    (department && department.event_categories.length === 1) ? department.event_categories[0] : null
  ));
  const [createMutate] = useMutation(CreateEventProposal);
  const [createProposal, createError, createInProgress] = useAsyncFunction(createMutate);
  const apolloClient = useApolloClient();

  const departmentEventCategories = useMemo(
    () => (
      department
        ? sortByLocaleString(
          proposableEventCategories.filter((category) => category.department
            && category.department.id === department.id),
          (category) => category.name,
        )
        : []
    ),
    [department, proposableEventCategories],
  );

  const createClicked = async () => {
    const {
      data: { createEventProposal: { event_proposal: eventProposal } },
    } = await createProposal({
      variables: {
        cloneEventProposalId: (cloneEventProposal || {}).id,
        eventCategoryId: eventCategory.id,
      },
    });
    await apolloClient.clearStore();

    onCreate(eventProposal);
  };

  return (
    <Modal visible={visible} dialogClassName="modal-lg" className="text-body">
      <div className="modal-header">
        New event proposal
      </div>
      <div className="modal-body text-left">
        <SelectWithLabel
          label="What category of event would you like to propose?"
          options={topLevelEntities}
          isClearable={topLevelEntities.length > 1}
          isDisabled={createInProgress}
          value={
            department || (eventCategory && eventCategory.department == null ? eventCategory : null)
          }
          getOptionValue={(option) => `${option.__typename}:${option.id}`}
          getOptionLabel={(option) => option.name}
          onChange={(entity) => {
            if (!entity) {
              setDepartment(null);
              setEventCategory(null);
            } else if (entity.__typename === 'Department') {
              setDepartment(entity);
              setEventCategory(null);
            } else if (entity.__typename === 'EventCategory') {
              setDepartment(null);
              setEventCategory(entity);
            }
          }}
        />

        {department && (
          <>
            {department.proposal_description && (
              <div className="alert alert-info">
                {department.proposal_description}
              </div>
            )}

            <SelectWithLabel
              label={`What subcategory of ${department.name} event would you like to propose?`}
              options={departmentEventCategories}
              isClearable
              isDisabled={createInProgress}
              value={eventCategory}
              getOptionValue={(option) => option.id}
              getOptionLabel={(option) => option.name}
              onChange={(category) => { setEventCategory(category); }}
            />
          </>
        )}

        {eventCategory && eventCategory.proposal_description && (
          <div className="alert alert-info">
            {eventCategory.proposal_description}
          </div>
        )}

        <hr />

        <SelectWithLabel
          label={
            `If you'd like to propose an event you've proposed sometime in the past,
            please select it here to have its information copied into the proposal form.
            Otherwise, leave this field blank.`
          }
          options={(userEventProposals || [])
            .filter((eventProposal) => eventProposal.status !== 'draft')
            .filter((eventProposal) => (
              eventCategory
              && eventProposal.event_category.name.toLowerCase()
              === eventCategory.name.toLowerCase()
            ))}
          isClearable
          isDisabled={createInProgress}
          value={cloneEventProposal}
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => `${option.title} (${option.event_category.name}, ${option.convention.name})`}
          onChange={(proposal) => { setCloneEventProposal(proposal); }}
        />

        {
          (
            cloneEventProposal && eventCategory
            && (
              cloneEventProposal.event_category.name.toLowerCase()
              !== eventCategory.name.toLowerCase()
            )
          )
            ? (
              <div className="mt-4 alert alert-warning">
                {'You are proposing a '}
                {eventCategory.name}
                {', but copying information from '}
                {cloneEventProposal.title}
                {', which is a '}
                {cloneEventProposal.event_category.name}
                {'. '}
                Make sure this is what you want before continuing.  You will not be able to change
                {' '}
                the category of your new event once you have started the proposal.
              </div>
            )
            : null
        }

        <ErrorDisplay graphQLError={createError} />
      </div>
      <div className="modal-footer">
        <button
          className="btn btn-secondary"
          type="button"
          disabled={createInProgress}
          onClick={cancel}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          type="button"
          disabled={!eventCategory || createInProgress}
          onClick={createClicked}
        >
          Create proposal
        </button>
      </div>
    </Modal>
  );
}

CreateEventProposalModal.propTypes = {
  onCreate: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  departments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    proposal_description: PropTypes.string,
  })).isRequired,
  userEventProposals: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    convention: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  })).isRequired,
  proposableEventCategories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    proposable: PropTypes.bool.isRequired,
  })).isRequired,
};

export default CreateEventProposalModal;
