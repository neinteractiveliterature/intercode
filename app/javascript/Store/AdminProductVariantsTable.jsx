import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Preview } from 'react-dnd-multi-backend';

import AdminProductVariantEditRow from './AdminProductVariantEditRow';
import sortProductVariants from './sortProductVariants';
import { mutator, parseMoneyOrNull, Transforms } from '../ComposableFormUtils';
import { describeAdminPricingStructure } from './describePricingStructure';

const variantMatches = (a, b) => (
  (a.generatedId && b.generatedId === a.generatedId)
  || (a.id && b.id === a.id)
);

const productVariantUpdater = (
  getProductVariants, setProductVariants, variant, transforms,
) => mutator({
  getState: () => getProductVariants()
    .find((existingVariant) => variantMatches(variant, existingVariant)),

  setState: (state) => {
    const newVariants = getProductVariants().map((existingVariant) => {
      if (variantMatches(variant, existingVariant)) {
        return { ...existingVariant, ...state };
      }

      return existingVariant;
    });

    setProductVariants(newVariants);
  },

  transforms,
});

function AdminProductVariantsTable({
  product, editing, onChange, deleteVariant,
}) {
  const tableRef = useRef();

  const addVariantClicked = () => {
    const position = Math.max(0, ...product.product_variants
      .map((variant) => variant.position)) + 1;

    onChange([
      ...product.product_variants,
      {
        generatedId: new Date().getTime(),
        name: null,
        description: null,
        override_price: null,
        position,
      },
    ]);
  };

  const deleteVariantClicked = (variant) => {
    if (variant.id) {
      deleteVariant(variant.id);
    } else if (variant.generatedId) {
      onChange(product.product_variants
        .filter((existingVariant) => existingVariant.generatedId !== variant.generatedId));
    }
  };

  const moveVariant = (dragIndex, hoverIndex) => {
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

    onChange(newVariants);
  };

  const generatePreview = (type, { productVariant, index }, style) => {
    if (type === 'PRODUCT_VARIANT') {
      return (
        <table style={{ ...style, width: `${tableRef.current.offsetWidth}px` }}>
          <AdminProductVariantEditRow
            productId={product.id}
            index={index}
            variant={productVariant}
            deleteVariant={() => { }}
            updater={{}}
            moveVariant={() => { }}
            isDragging={false}
          />
        </table>
      );
    }

    return null;
  };

  const renderAddVariantButton = () => {
    if (!editing) {
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
  if (editing) {
    variants = product.product_variants
      .filter((variant) => !product.delete_variant_ids.includes(variant.id));
  } else {
    variants = product.product_variants;
  }

  const rows = sortProductVariants(variants).map((variant, index) => {
    if (editing) {
      const variantUpdater = productVariantUpdater(
        () => product.product_variants,
        onChange,
        variant,
        {
          name: Transforms.identity,
          description: Transforms.identity,
          override_pricing_structure: Transforms.identity,
        },
      );

      return (
        <AdminProductVariantEditRow
          index={index}
          key={variant.id || variant.generatedId}
          productId={product.id || product.generatedId}
          variant={variant}
          updater={variantUpdater}
          deleteVariant={() => deleteVariantClicked(variant)}
          moveVariant={moveVariant}
        />
      );
    }

    return (
      <tr key={variant.id}>
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
        <tbody>
          {rows}
        </tbody>
      </table>
      <Preview generator={generatePreview} />
      {renderAddVariantButton()}
    </div>
  );
}

AdminProductVariantsTable.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    generatedId: PropTypes.number,
    product_variants: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      description: PropTypes.string,
      override_price: PropTypes.shape({
        fractional: PropTypes.number,
        currency_code: PropTypes.string,
      }),
    })),
    delete_variant_ids: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  editing: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  deleteVariant: PropTypes.func.isRequired,
};

export default AdminProductVariantsTable;
