import { useCallback, useMemo } from 'react';
import * as React from 'react';
import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBasicSortableHandlers, useMatchWidthStyle } from '@neinteractiveliterature/litform';
import { v4 as uuidv4 } from 'uuid';

import AdminProductVariantEditRow from './AdminProductVariantEditRow';
import sortProductVariants from '../sortProductVariants';
import { describeAdminPricingStructure } from '../describePricingStructure';
import { EditingProduct, EditingVariant } from './EditingProductTypes';
import { getRealOrGeneratedId, hasRealId, realOrGeneratedIdsMatch } from '../../GeneratedIdUtils';
import AdminProductVariantDragOverlayDisplay from './AdminProductVariantDragOverlayDisplay';
import { useSortableDndSensors } from '../../SortableUtils';
import { useTranslation } from 'react-i18next';

function updateVariant(
  productVariants: EditingVariant[],
  setProductVariants: React.Dispatch<React.SetStateAction<EditingVariant[]>>,
  variant: EditingVariant,
  getNewValue: (prevVariant: EditingVariant) => EditingVariant,
) {
  const newVariants = productVariants.map((existingVariant) => {
    if (realOrGeneratedIdsMatch(variant, existingVariant)) {
      return { ...existingVariant, ...getNewValue(variant) };
    }

    return existingVariant;
  });

  setProductVariants(newVariants);
}

type AdminProductVariantsTableCommonProps = {
  product: EditingProduct;
};

type AdminProductVariantsTableEditingProps = AdminProductVariantsTableCommonProps & {
  editing: boolean;
  onChange: React.Dispatch<EditingVariant[]>;
  deleteVariant: React.Dispatch<string>;
};

type AdminProductVariantsTableViewingProps = AdminProductVariantsTableCommonProps & {
  editing: false;
};

export type AdminProductVariantsTableProps =
  | AdminProductVariantsTableEditingProps
  | AdminProductVariantsTableViewingProps;

 
const noop = () => {};

function AdminProductVariantsTable(props: AdminProductVariantsTableProps): JSX.Element {
  const { product, editing } = props;
  const [matchWidthRef, matchWidthStyle] = useMatchWidthStyle<HTMLTableElement>();
  const { t } = useTranslation();

  const onChange = editing ? props.onChange : noop;

  let variants: EditingVariant[];
  if (props.editing) {
    variants = product.product_variants.filter(
      (variant) => !(hasRealId(variant) && product.delete_variant_ids.includes(variant.id)),
    );
  } else {
    variants = product.product_variants;
  }

  const sortedVariants = useMemo(() => sortProductVariants(variants), [variants]);

  const sensors = useSortableDndSensors();

  const addVariantClicked = () => {
    const position = Math.max(0, ...product.product_variants.map((variant) => variant.position ?? 0)) + 1;

    onChange([
      ...product.product_variants,
      {
        __typename: 'ProductVariant',
        generatedId: uuidv4(),
        name: '',
        description: '',
        position,
      },
    ]);
  };

  const deleteVariantClicked = (variant: EditingVariant) => {
    if (!editing) {
      return;
    }

    if (hasRealId(variant)) {
      props.deleteVariant(variant.id);
    } else {
      onChange(
        product.product_variants.filter((existingVariant) => !realOrGeneratedIdsMatch(variant, existingVariant)),
      );
    }
  };

  const moveVariant = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragVariant = sortedVariants[dragIndex];
      const hoverVariant = sortedVariants[hoverIndex];

      const newVariants = sortedVariants.map((variant, index) => {
        if (index === dragIndex) {
          return { ...variant, position: hoverVariant.position };
        }

        if (index === hoverIndex) {
          return { ...variant, position: dragVariant.position };
        }

        return variant;
      });

      onChange(newVariants);
    },
    [sortedVariants, onChange],
  );

  const { draggingItem, ...sortableHandlers } = useBasicSortableHandlers(
    useCallback(
      (id: string) => sortedVariants.find((variant) => getRealOrGeneratedId(variant).toString() === id),
      [sortedVariants],
    ),
    useCallback(
      (id: string) => sortedVariants.findIndex((variant) => getRealOrGeneratedId(variant).toString() === id),
      [sortedVariants],
    ),
    moveVariant,
  );

  const renderAddVariantButton = () => {
    if (!props.editing) {
      return null;
    }

    return (
      <button type="button" className="btn btn-primary btn-sm" onClick={addVariantClicked}>
        Add variant
      </button>
    );
  };

  if (product.product_variants.length === 0) {
    return (
      <div>
        <p>This product does not have any variants.</p>
        {renderAddVariantButton()}
      </div>
    );
  }

  const rows = sortedVariants.map((variant) => {
    if (props.editing) {
      const variantUpdater = (getNewValue: (prevValue: EditingVariant) => EditingVariant) =>
        updateVariant(product.product_variants, props.onChange, variant, getNewValue);

      return (
        <AdminProductVariantEditRow
          key={getRealOrGeneratedId(variant)}
          variant={variant}
          updateVariant={variantUpdater}
          deleteVariant={() => deleteVariantClicked(variant)}
        />
      );
    }

    return (
      <tr key={getRealOrGeneratedId(variant)}>
        <td />
        <td>{variant.name}</td>
        <td>{variant.description}</td>
        <td>{describeAdminPricingStructure(variant.override_pricing_structure, t)}</td>
        <td />
      </tr>
    );
  });

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} {...sortableHandlers}>
      <div className="mt-2">
        <table className="table table-sm" ref={matchWidthRef}>
          <thead>
            <tr>
              <th />
              <th>Variant name</th>
              <th>Description</th>
              <th>Override price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <SortableContext
              items={sortedVariants.map((variant) => getRealOrGeneratedId(variant).toString())}
              strategy={verticalListSortingStrategy}
            >
              {rows}
            </SortableContext>
          </tbody>
        </table>
        <DragOverlay>
          {draggingItem && (
            <table style={matchWidthStyle}>
              <tbody>
                <AdminProductVariantDragOverlayDisplay variant={draggingItem} />
              </tbody>
            </table>
          )}
        </DragOverlay>
        {renderAddVariantButton()}
      </div>
    </DndContext>
  );
}

export default AdminProductVariantsTable;
