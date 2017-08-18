import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../../react-bootstrap4-modal/src/Modal';

const ConfirmModal = ({ visible, onOK, onCancel, children }) => (
  <Modal visible={visible} onClickBackdrop={() => { console.log('backdrop') }}>
    <div className="modal-header">
      <h5 className="modal-title">Confirmation</h5>
    </div>
    <div className="modal-body">
      {children}
    </div>
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onCancel}>
        Cancel
      </button>
      <button type="button" className="btn btn-primary" onClick={onOK}>
        OK
      </button>
    </div>
  </Modal>
);

ConfirmModal.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  onOK: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmModal;
