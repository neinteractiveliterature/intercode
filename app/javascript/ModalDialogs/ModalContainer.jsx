import PropTypes from 'prop-types';

import useModal from './useModal';

function ModalContainer({ children, initiallyOpen }) {
  const modal = useModal(initiallyOpen);

  return children({
    modalVisible: modal.visible,
    modalState: modal.state,
    openModal: modal.open,
    closeModal: modal.close,
    setModalState: modal.setState,
  });
}

ModalContainer.propTypes = {
  children: PropTypes.func.isRequired,
  initiallyOpen: PropTypes.bool,
};

export default ModalContainer;
