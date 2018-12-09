import React from 'react';
import PropTypes from 'prop-types';

export default class ModalContainer extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    initiallyOpen: PropTypes.bool,
  };

  static defaultProps = {
    initiallyOpen: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      visible: props.initiallyOpen,
      modalState: null,
    };
  }

  render = () => this.props.children({
    modalVisible: this.state.visible,
    modalState: this.state.modalState,
    openModal: (modalState) => { this.setState({ visible: true, modalState }); },
    closeModal: () => { this.setState({ visible: false, modalState: null }); },
    setModalState: (modalState) => { this.setState({ modalState }); },
  })
}
