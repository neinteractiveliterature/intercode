import InPlaceEditor from '../../BuiltInFormControls/InPlaceEditor';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import PricingStructureInput from './PricingStructureInput';
import { EditingVariant } from './EditingProductTypes';

export type AdminProductVariantDragOverlayDisplayProps = {
  variant: EditingVariant;
};

function AdminProductVariantDragOverlayDisplay({
  variant,
}: AdminProductVariantDragOverlayDisplayProps): JSX.Element {
  return (
    <tr className="bg-light border border-secondary">
      <td>
        <i className="bi-grip-vertical cursor-grab">
          <span className="visually-hidden">Drag to reorder</span>
        </i>
      </td>
      <td>
        <InPlaceEditor value={variant.name ?? ''} onChange={() => {}} />
      </td>
      <td>
        <InPlaceEditor<typeof variant.description>
          className="d-flex align-items-start"
          value={variant.description ?? ''}
          onChange={() => {}}
          renderInput={({ buttons, inputProps: { value, onChange } }) => (
            <>
              <LiquidInput value={value ?? ''} onChange={onChange} className="col" />
              {buttons}
            </>
          )}
        />
      </td>
      <td>
        <PricingStructureInput value={variant.override_pricing_structure} onChange={() => {}} />
      </td>
      <td>
        <button type="button" className="btn btn-sm btn-danger">
          <i className="bi-trash">
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

export default AdminProductVariantDragOverlayDisplay;
