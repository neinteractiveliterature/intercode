import React from 'react';
import PropTypes from 'prop-types';
import { enableUniqueIds } from 'react-html-id';

class FreeTextItem extends React.Component {
  constructor(props) {
    super(props);
    enableUniqueIds(this);
  }

  renderLabel = (formItem, domId) => <label htmlFor={domId} className="form-item-label" dangerouslySetInnerHTML={{ __html: formItem.caption }} />

  renderInput = (formItem, domId) => {
    if (formItem.lines === 1) {
      return <input id={domId} type={formItem.free_text_type || 'text'} className="form-control" />;
    }
    return <textarea id={domId} rows={formItem.lines} className="form-control" />;
  }

  render = () => {
    const { formItem } = this.props;
    const domId = this.nextUniqueId();

    return (
      <div className="form-group">
        {this.renderLabel(formItem, domId)}
        {this.renderInput(formItem, domId)}
      </div>
    );
  };
}

export default FreeTextItem;
