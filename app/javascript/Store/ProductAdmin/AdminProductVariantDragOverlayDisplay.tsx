import InPlaceEditor from '../../BuiltInFormControls/InPlaceEditor';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import PricingStructureInput from './PricingStructureInput';
import { EditingVariant } from './EditingProductTypes';
import { useTranslation } from 'react-i18next';

export type AdminProductVariantDragOverlayDisplayProps = {
  variant: EditingVariant;
};

function AdminProductVariantDragOverlayDisplay({ variant }: AdminProductVariantDragOverlayDisplayProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <tr className="bg-light border border-secondary">
      <td>
        <i className="bi-grip-vertical cursor-grab">
          <span className="visually-hidden">{t('buttons.dragToReorder')}</span>
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
        <button
          type="button"
          className="btn btn-sm btn-danger"
          aria-label={t('admin.store.products.deleteVariant', { name: variant.name })}
        >
          <i className="bi-trash" />
        </button>
      </td>
    </tr>
  );
}

export default AdminProductVariantDragOverlayDisplay;
