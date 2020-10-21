import React, { useRef } from 'react';
import { Preview, PreviewGenerator } from 'react-dnd-multi-backend';

import AdminProductVariantEditRow from './AdminProductVariantEditRow';
import sortProductVariants from '../sortProductVariants';
import { describeAdminPricingStructure } from '../describePricingStructure';
import { EditingProduct, EditingVariant } from './EditingProductTypes';
import { getRealOrGeneratedId, hasRealId, realOrGeneratedIdsMatch } from '../../GeneratedIdUtils';

function updateVariant(
  productVariants: EditingVariant[],
  setProductVariants: React.Dispatch<EditingVariant[]>,
  variant: EditingVariant,
  newValue: Partial<EditingVariant>,
) {
  const newVariants = productVariants.map((existingVariant) => {
    if (realOrGeneratedIdsMatch(variant, existingVariant)) {
      return { ...existingVariant, ...newValue };
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
  deleteVariant: React.Dispatch<number>;
};

type AdminProductVariantsTableViewingProps = AdminProductVariantsTableCommonProps & {
  editing: false;
};

export type AdminProductVariantsTableProps =
  | AdminProductVariantsTableEditingProps
  | AdminProductVariantsTableViewingProps;

function AdminProductVariantsTable(props: AdminProductVariantsTableProps) {
  const { product } = props;
  const tableRef = useRef<HTMLTableElement>(null);

  const addVariantClicked = () => {
    if (!props.editing) {
      return;
    }

    const position =
      Math.max(0, ...product.product_variants.map((variant) => variant.position ?? 0)) + 1;

    props.onChange([
      ...product.product_variants,
      {
        __typename: 'ProductVariant',
        generatedId: new Date().getTime(),
        name: '',
        description: '',
        position,
      },
    ]);
  };

  const deleteVariantClicked = (variant: EditingVariant) => {
    if (!props.editing) {
      return;
    }

    if (hasRealId(variant)) {
      props.deleteVariant(variant.id);
    } else {
      props.onChange(
        product.product_variants.filter(
          (existingVariant) => !realOrGeneratedIdsMatch(variant, existingVariant),
        ),
      );
    }
  };

  const moveVariant = (dragIndex: number, hoverIndex: number) => {
    if (!props.editing) {
      return;
    }

    const variants = sortProductVariants(product.product_variants);
    const dragVariant = variants[dragIndex];
    const hoverVariant = variants[hoverIndex];

    const newVariants = variants.map((variant, index) => {
      if (index === dragIndex) {
        return { ...variant, position: hoverVariant.position };
      }

      if (index === hoverIndex) {
        return { ...variant, position: dragVariant.position };
      }

      return variant;
    });

    props.onChange(newVariants);
  };

  const generatePreview: PreviewGenerator<{ index: number }> = ({
    itemType,
    item: { index },
    style,
  }) => {
    if (itemType === 'PRODUCT_VARIANT') {
      return (
        <table
          style={{
            ...style,
            width: tableRef.current ? `${tableRef.current.offsetWidth}px` : undefined,
          }}
        >
          <AdminProductVariantEditRow
            index={index}
            variant={product.product_variants[index]}
            deleteVariant={() => {}}
            updateVariant={() => {}}
            moveVariant={() => {}}
          />
        </table>
      );
    }

    return null;
  };

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

  let variants;
  if (props.editing) {
    variants = product.product_variants.filter(
      (variant) => !(hasRealId(variant) && product.delete_variant_ids.includes(variant.id)),
    );
  } else {
    variants = product.product_variants;
  }

  const rows = sortProductVariants(variants).map((variant, index) => {
    if (props.editing) {
      const variantUpdater = (newValue: EditingVariant) =>
        updateVariant(product.product_variants, props.onChange, variant, newValue);

      return (
        <AdminProductVariantEditRow
          index={index}
          key={getRealOrGeneratedId(variant)}
          variant={variant}
          updateVariant={variantUpdater}
          deleteVariant={() => deleteVariantClicked(variant)}
          moveVariant={moveVariant}
        />
      );
    }

    return (
      <tr key={getRealOrGeneratedId(variant)}>
        <td />
        <td>{variant.name}</td>
        <td>{variant.description}</td>
        <td>{describeAdminPricingStructure(variant.override_pricing_structure)}</td>
        <td />
      </tr>
    );
  });

  return (
    <div className="mt-2">
      <table className="table table-sm" ref={tableRef}>
        <thead>
          <tr>
            <th />
            <th>Variant name</th>
            <th>Description</th>
            <th>Override price</th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      <Preview generator={generatePreview} />
      {renderAddVariantButton()}
    </div>
  );
}

export default AdminProductVariantsTable;
