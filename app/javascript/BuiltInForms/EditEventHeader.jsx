import React from 'react';
import PropTypes from 'prop-types';

import { useConfirm } from '../ModalDialogs/Confirm';
import ErrorDisplay from '../ErrorDisplay';

function EditEventHeader({ event, showDropButton, dropEvent }) {
  const confirm = useConfirm();

  let dropButton = null;
  if (showDropButton && event.id && event.status !== 'dropped') {
    dropButton = (
      <button
        type="button"
        className="btn btn-outline-danger float-right"
        onClick={() => confirm({
          prompt: `Are you sure you want to drop ${event.title}?  Doing so will
              also delete any runs of this event and remove any participants signed up
              for those runs.`,
          action: dropEvent,
          renderError: error => <ErrorDisplay graphQLError={error} />,
        })}
      >
        Drop event
      </button>
    );
  }

  return (
    <header>
      {dropButton}

      <h3 className="mb-4">
        {event.id ? 'Edit event' : 'New event'}
      </h3>
    </header>
  );
}

EditEventHeader.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  showDropButton: PropTypes.bool.isRequired,
  dropEvent: PropTypes.func.isRequired,
};

export default EditEventHeader;
