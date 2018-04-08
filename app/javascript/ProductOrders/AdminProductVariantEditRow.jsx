import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import formatMoney from '../formatMoney';
import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import LiquidInput from '../BuiltInFormControls/LiquidInput';

const productVariantDragSource = {
  beginDrag(props) {
    return { productVariant: props.variant, productId: props.productId, index: props.index };
  },
};

const productVariantDropTarget = {
  // Largely stolen from https://github.com/react-dnd/react-dnd/tree/master/packages/documentation/examples/04%20Sortable/Simple
  hover(props, monitor) {
    const { productId } = monitor.getItem();
    if (props.productId !== productId) {
      return;
    }

    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveVariant(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

function collectProductVariantDrag(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

function collectProductVariantDrop(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

@DragSource('PRODUCT_VARIANT', productVariantDragSource, collectProductVariantDrag)
@DropTarget('PRODUCT_VARIANT', productVariantDropTarget, collectProductVariantDrop)
class AdminProductVariantEditRow extends React.Component {
  static propTypes = {
    productId: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    variant: PropTypes.shape({
      id: PropTypes.number,
      generatedId: PropTypes.number,
      name: PropTypes.string,
      description: PropTypes.string,
      override_price: PropTypes.shape({
        fractional: PropTypes.number,
        currency_code: PropTypes.number,
      }),
    }).isRequired,
    deleteVariant: PropTypes.func.isRequired,
    updater: PropTypes.shape({
      name: PropTypes.func.isRequired,
      description: PropTypes.func.isRequired,
      override_price: PropTypes.func.isRequired,
    }).isRequired,
    moveVariant: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
  }

  render = () => {
    const {
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
      isDragging,
      variant,
      updater,
      deleteVariant,
    } = this.props;

    return connectDropTarget(connectDragPreview((
      <tr key={variant.id || variant.generatedId} className={isDragging ? 'opacity-50' : null}>
        <td>
          {connectDragSource((
            <i className="fa fa-ellipsis-v cursor-grab">
              <span className="sr-only">Drag to reorder</span>
            </i>
          ))}
        </td>
        <td>
          <InPlaceEditor
            value={variant.name}
            onChange={updater.name || ''}
          />
        </td>
        <td>
          <InPlaceEditor
            className="d-flex align-items-start"
            value={variant.description || ''}
            onChange={updater.description}
            renderInput={({ value, onChange }) => (
              <LiquidInput value={value} onChange={onChange} className="col" />
            )}
          />
        </td>
        <td>
          <InPlaceEditor
            value={variant.override_price ? `${formatMoney(variant.override_price, false)}` : ''}
            onChange={updater.override_price}
          >
            {variant.override_price ? formatMoney(variant.override_price) : null}
          </InPlaceEditor>
        </td>
        <td>
          <button
            className="btn btn-sm btn-danger"
            onClick={deleteVariant}
          >
            <i className="fa fa-trash-o">
              <span className="sr-only">Delete {variant.name}</span>
            </i>
          </button>
        </td>
      </tr>
    )));
  }
}

export default AdminProductVariantEditRow;
