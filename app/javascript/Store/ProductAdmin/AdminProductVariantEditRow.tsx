import { usePropertySetters } from '@neinteractiveliterature/litform';
import { FunctionalStateUpdater } from '@neinteractiveliterature/litform/lib/usePropertySetters';

import InPlaceEditor from '../../BuiltInFormControls/InPlaceEditor';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import useSortable from '../../useSortable';
import PricingStructureInput from './PricingStructureInput';
import { EditingVariant } from './EditingProductTypes';

export type AdminProductVariantEditRowProps = {
  variant: EditingVariant;
  updateVariant: FunctionalStateUpdater<EditingVariant>;
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
  const [setName, setDescription, setOverridePricingStructure] = usePropertySetters(
    updateVariant,
    'name',
    'description',
    'override_pricing_structure',
  );

  return (
    <tr className={isDragging ? 'opacity-50' : undefined} ref={rowRef}>
      <td ref={drag}>
        <i className="fa fa-bars cursor-grab">
          <span className="visually-hidden">Drag to reorder</span>
        </i>
      </td>
      <td>
        <InPlaceEditor value={variant.name ?? ''} onChange={setName} />
      </td>
      <td>
        <InPlaceEditor<typeof variant.description>
          className="d-flex align-items-start"
          value={variant.description ?? ''}
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
          value={variant.override_pricing_structure}
          onChange={setOverridePricingStructure}
        />
      </td>
      <td>
        <button type="button" className="btn btn-sm btn-danger" onClick={deleteVariant}>
          <i className="fa fa-trash-o">
            <span className="visually-hidden">
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
