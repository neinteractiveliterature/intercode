import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { Mutation } from 'react-apollo';
import { enableUniqueIds } from 'react-html-id';

import { CreateEventProposal } from './mutations.gql';
import ErrorDisplay from '../ErrorDisplay';
import SelectWithLabel from '../BuiltInFormControls/SelectWithLabel';

class CreateEventProposalModal extends React.Component {
  static propTypes = {
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

  constructor(props) {
    super(props);
    enableUniqueIds(this);

    this.state = {
      cloneEventProposal: null,
      eventCategory: (
        props.proposableEventCategories.length > 1
          ? null
          : props.proposableEventCategories[0]
      ),
      error: null,
    };
  }

  createEventProposal = async (mutate) => {
    this.setState({ mutationInProgress: true });
    try {
      const { data: { createEventProposal: { event_proposal: eventProposal } } } = await mutate({
        variables: {
          cloneEventProposalId: (this.state.cloneEventProposal || {}).id,
          eventCategoryId: this.state.eventCategory.id,
        },
      });

      this.props.onCreate(eventProposal);
    } catch (error) {
      this.setState({ mutationInProgress: false, error });
    }
  }

  render = () => (
    <Modal visible={this.props.visible} dialogClassName="modal-lg" className="text-body">
      <div className="modal-header">
        New event proposal
      </div>
      <div className="modal-body text-left">
        <SelectWithLabel
          label="What category of event would you like to propose?"
          options={this.props.proposableEventCategories}
          isClearable={this.props.proposableEventCategories.length > 1}
          isDisabled={this.state.mutationInProgress}
          value={this.state.eventCategory}
          getOptionValue={option => option.id}
          getOptionLabel={option => option.name}
          onChange={(eventCategory) => { this.setState({ eventCategory }); }}
        />

        <SelectWithLabel
          label={
            `If you'd like to propose an event you've proposed sometime in the past,
            please select it here to have its information copied into the proposal form.
            Otherwise, leave this field blank.`
          }
          options={(this.props.userEventProposals || [])
            .filter(eventProposal => eventProposal.status !== 'draft')
            .filter(eventProposal => (
              this.state.eventCategory
              && eventProposal.event_category.name.toLowerCase()
                === this.state.eventCategory.name.toLowerCase()
            ))}
          isClearable
          isDisabled={this.state.mutationInProgress}
          value={this.state.cloneEventProposal}
          getOptionValue={option => option.id}
          getOptionLabel={option => `${option.title} (${option.event_category.name}, ${option.convention.name})`}
          onChange={(cloneEventProposal) => { this.setState({ cloneEventProposal }); }}
        />

        {
          (
            this.state.cloneEventProposal && this.state.eventCategory
            && this.state.cloneEventProposal.event_category.name !== this.state.eventCategory.name
          )
            ? (
              <div className="mt-4 alert alert-warning">
                {'You are proposing a '}
                {this.state.eventCategory.name}
                {', but copying information from '}
                {this.state.cloneEventProposal.title}
                {', which is a '}
                {this.state.cloneEventProposal.event_category.name}
                {'. '}
                Make sure this is what you want before continuing.  You will not be able to change
                {' '}
                the category of your new event once you have started the proposal.
              </div>
            )
            : null
        }

        <ErrorDisplay graphQLError={this.state.error} />
      </div>
      <div className="modal-footer">
        <button
          className="btn btn-secondary"
          type="button"
          disabled={this.state.mutationInProgress}
          onClick={this.props.cancel}
        >
          Cancel
        </button>
        <Mutation mutation={CreateEventProposal}>
          {mutate => (
            <button
              className="btn btn-primary"
              type="button"
              disabled={!this.state.eventCategory || this.state.mutationInProgress}
              onClick={() => this.createEventProposal(mutate)}
            >
              Create proposal
            </button>
          )}
        </Mutation>
      </div>
    </Modal>
  )
}

export default CreateEventProposalModal;
