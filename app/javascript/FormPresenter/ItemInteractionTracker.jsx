import React from 'react';
import PropTypes from 'prop-types';
import { Set } from 'immutable';

const ItemInteractionTrackerContext = React.createContext({
  interactWithItem: () => {},
  hasInteractedWithItem: () => false,
});

export default class ItemInteractionTracker extends React.Component {
  static Interactor = ItemInteractionTrackerContext.Consumer;

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      interactedItemIds: new Set(),
    };
  }

  interactWithItem = (itemId) => {
    this.setState(prevState => ({ interactedItemIds: prevState.interactedItemIds.add(itemId) }));
  }

  hasInteractedWithItem = itemId => this.state.interactedItemIds.contains(itemId)

  render = () => (
    <ItemInteractionTrackerContext.Provider
      value={{
        interactWithItem: this.interactWithItem,
        hasInteractedWithItem: this.hasInteractedWithItem,
      }}
    >
      {this.props.children}
    </ItemInteractionTrackerContext.Provider>
  )
}
