import { FunctionalStateUpdater, usePropertySetters } from '@neinteractiveliterature/litform';
import { useSortable } from '@dnd-kit/sortable';

import InPlaceEditor from '../../BuiltInFormControls/InPlaceEditor';
import LiquidInput from '../../BuiltInFormControls/LiquidInput';
import PricingStructureInput from './PricingStructureInput';
import { EditingVariant } from './EditingProductTypes';
import { getRealOrGeneratedId } from '../../GeneratedIdUtils';
import { getSortableStyle } from '../../SortableUtils';
import { useTranslation } from 'react-i18next';

export type AdminProductVariantEditRowProps = {
  variant: EditingVariant;
  updateVariant: FunctionalStateUpdater<EditingVariant>;
  deleteVariant: () => void;
};

function AdminProductVariantEditRow({
  variant,
  updateVariant,
  deleteVariant,
}: AdminProductVariantEditRowProps): React.JSX.Element {
  const { t } = useTranslation();
  const { setNodeRef, transform, attributes, listeners, transition, isDragging } = useSortable({
    id: getRealOrGeneratedId(variant).toString(),
  });
  const [setName, setDescription, setOverridePricingStructure] = usePropertySetters(
    updateVariant,
    'name',
    'description',
    'override_pricing_structure',
  );

  const style = getSortableStyle(transform, transition, isDragging);

  return (
    <tr style={style}>
      <td {...attributes} {...listeners} ref={setNodeRef}>
        <i className="bi-grip-vertical cursor-grab">
          <span className="visually-hidden">{t('buttons.dragToReorder')}</span>
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
        <PricingStructureInput value={variant.override_pricing_structure} onChange={setOverridePricingStructure} />
      </td>
      <td>
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={deleteVariant}
          aria-label={t('admin.store.products.deleteVariant', { name: variant.name })}
        >
          <i className="bi-trash" />
        </button>
      </td>
    </tr>
  );
}

export default AdminProductVariantEditRow;
