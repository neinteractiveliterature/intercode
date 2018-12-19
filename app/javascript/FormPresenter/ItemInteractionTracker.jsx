import React from 'react';
import PropTypes from 'prop-types';

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
    this.setState((prevState) => {
      const newInteractedItemIds = new Set(prevState.interactedItemIds);
      newInteractedItemIds.add(itemId);
      return { interactedItemIds: newInteractedItemIds };
    });
  }

  hasInteractedWithItem = itemId => this.state.interactedItemIds.has(itemId)

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
