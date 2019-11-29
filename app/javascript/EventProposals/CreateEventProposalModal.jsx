import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { useApolloClient, useMutation } from 'react-apollo-hooks';

import { CreateEventProposal } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';
import useAsyncFunction from '../useAsyncFunction';

function CreateEventProposalModal({
  onCreate, cancel, visible, userEventProposals, proposableEventCategories,
}) {
  const [cloneEventProposal, setCloneEventProposal] = useState(null);
  const [eventCategory, setEventCategory] = useState(
    proposableEventCategories.length > 1 ? null : proposableEventCategories[0],
  );
  const [createMutate] = useMutation(CreateEventProposal);
  const [createProposal, createError, createInProgress] = useAsyncFunction(createMutate);
  const apolloClient = useApolloClient();

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
          options={proposableEventCategories}
          isClearable={proposableEventCategories.length > 1}
          isDisabled={createInProgress}
          value={eventCategory}
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
          onChange={(category) => { setEventCategory(category); }}
        />

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
