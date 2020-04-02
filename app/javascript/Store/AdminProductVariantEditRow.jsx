import React from 'react';
import PropTypes from 'prop-types';

import InPlaceEditor from '../BuiltInFormControls/InPlaceEditor';
import LiquidInput from '../BuiltInFormControls/LiquidInput';
import useSortable from '../useSortable';
import PricingStructureInput from './PricingStructureInput';

function AdminProductVariantEditRow({
  variant, updater, deleteVariant, moveVariant, index,
}) {
  const [rowRef, drag, { isDragging }] = useSortable(index, moveVariant, 'PRODUCT_VARIANT');

  return (
    <tr
      key={variant.id || variant.generatedId}
      className={isDragging ? 'opacity-50' : null}
      ref={rowRef}
    >
      <td ref={drag}>
        <i className="fa fa-bars cursor-grab">
          <span className="sr-only">Drag to reorder</span>
        </i>
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
          renderInput={({ buttons, inputProps: { value, onChange } }) => (
            <>
              <LiquidInput value={value} onChange={onChange} className="col" />
              {buttons}
            </>
          )}
        />
      </td>
      <td>
        <PricingStructureInput
          value={variant.override_pricing_structure || {}}
          onChange={updater.override_pricing_structure}
        />
      </td>
      <td>
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={deleteVariant}
        >
          <i className="fa fa-trash-o">
            <span className="sr-only">
              Delete
              {variant.name}
            </span>
          </i>
        </button>
      </td>
    </tr>
  );
}

AdminProductVariantEditRow.propTypes = {
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
};

export default AdminProductVariantEditRow;
