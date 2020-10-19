import React from 'react';

import InPlaceEditor from '../../BuiltInFormControls/InPlaceEditor';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import { usePartialState, usePartialStateFactoryWithValueSetter } from '../../usePartialState';
import useSortable from '../../useSortable';
import PricingStructureInput from '../PricingStructureInput';
import { EditingVariant } from './EditingProductTypes';

export type AdminProductVariantEditRowProps = {
  variant: EditingVariant;
  updateVariant: React.Dispatch<EditingVariant>;
  deleteVariant: () => void;
  moveVariant: (dragIndex: number, hoverIndex: number) => void;
  index: number;
};

function AdminProductVariantEditRow({
  variant,
  updateVariant,
  deleteVariant,
  moveVariant,
  index,
}: AdminProductVariantEditRowProps) {
  const [rowRef, drag, { isDragging }] = useSortable<HTMLTableRowElement>(
    index,
    moveVariant,
    'PRODUCT_VARIANT',
  );
  const factory = usePartialStateFactoryWithValueSetter(variant, updateVariant);
  const [name, setName] = usePartialState(factory, 'name');
  const [description, setDescription] = usePartialState(factory, 'description');
  const [overridePricingStructure, setOverridePricingStructure] = usePartialState(
    factory,
    'override_pricing_structure',
  );

  return (
    <tr className={isDragging ? 'opacity-50' : undefined} ref={rowRef}>
      <td ref={drag}>
        <i className="fa fa-bars cursor-grab">
          <span className="sr-only">Drag to reorder</span>
        </i>
      </td>
      <td>
        <InPlaceEditor value={name ?? ''} onChange={setName} />
      </td>
      <td>
        <InPlaceEditor<typeof description>
          className="d-flex align-items-start"
          value={description ?? ''}
          onChange={setDescription}
          renderInput={({ buttons, inputProps: { value, onChange } }) => (
            <>
              <LiquidInput value={value ?? ''} onChange={onChange} className="col" />
              {buttons}
            </>
          )}
        />
      </td>
      <td>
        <PricingStructureInput
          value={overridePricingStructure ?? {}}
          onChange={setOverridePricingStructure}
        />
      </td>
      <td>
        <button type="button" className="btn btn-sm btn-danger" onClick={deleteVariant}>
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

export default AdminProductVariantEditRow;
