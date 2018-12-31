import React from 'react';
import PropTypes from 'prop-types';

import EventCategoryForm from './EventCategoryForm';

class EditEventCategory extends React.Component {
  static propTypes = {
    initialEventCategory: PropTypes.shape({}).isRequired,
    forms: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      eventCategory: props.initialEventCategory,
    };
  }

  render = () => (
    <>
      <h1 className="mb-4">Edit event category</h1>

      <EventCategoryForm
        value={this.state.eventCategory}
        onChange={(eventCategory) => { this.setState({ eventCategory }); }}
        forms={this.props.forms}
      />
    </>
  )
}

export default EditEventCategory;
