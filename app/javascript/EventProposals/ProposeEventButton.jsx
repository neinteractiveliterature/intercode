import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';
import { withRouter } from 'react-router-dom';

import CreateEventProposalModal from './CreateEventProposalModal';
import ModalContainer from '../ModalDialogs/ModalContainer';
import { ProposeEventButtonQuery } from './queries.gql';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import SignInButton from '../Authentication/SignInButton';

class ProposeEventButton extends React.Component {
  static propTypes = {
    caption: PropTypes.node.isRequired,
    className: PropTypes.string,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    className: 'btn btn-secondary',
  }

  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  newProposalCreated = (eventProposal) => {
    this.props.history.push(`/event_proposals/${eventProposal.id}/edit`);
  }

  renderProposeButton = (data) => {
    const buttonId = this.nextUniqueId();

    return (
      <ModalContainer>
        {({ modalVisible, openModal, closeModal }) => (
          <div>
            <button
              id={buttonId}
              className={this.props.className}
              type="button"
              onClick={openModal}
            >
              {this.props.caption}
            </button>

            <CreateEventProposalModal
              onCreate={this.newProposalCreated}
              cancel={closeModal}
              visible={modalVisible}
              userEventProposals={data.myProfile.user.event_proposals}
              proposableEventCategories={data.convention.event_categories
                .filter((category) => category.proposable)}
            />
          </div>
        )}
      </ModalContainer>
    );
  }

  renderLoginButton = () => (
    <SignInButton
      afterSignInPath={window.location.href}
      className={this.props.className}
      caption="Log in to propose an event"
    />
  )

  render = () => (
    <QueryWithStateDisplay query={ProposeEventButtonQuery}>
      {({ data }) => (
        data.myProfile
          ? this.renderProposeButton(data)
          : this.renderLoginButton()
      )}
    </QueryWithStateDisplay>
  )
}

export default withRouter(ProposeEventButton);
