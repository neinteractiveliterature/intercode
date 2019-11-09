import React from 'react';
import PropTypes from 'prop-types';
import MultiBackend, { Preview } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch'; // or any other pipeline
import { DndProvider } from 'react-dnd';

import AdminProductVariantEditRow from './AdminProductVariantEditRow';
import formatMoney from '../formatMoney';
import sortProductVariants from './sortProductVariants';
import { mutator, parseMoneyOrNull, Transforms } from '../ComposableFormUtils';

const variantMatches = (a, b) => (
  (a.generatedId && b.generatedId === a.generatedId)
  || (a.id && b.id === a.id)
);

const productVariantUpdaterForComponent = (component, variant, transforms) => mutator({
  getState: () => component.props.product.product_variants
    .find((existingVariant) => variantMatches(variant, existingVariant)),

  setState: (state) => {
    const newVariants = component.props.product.product_variants.map((existingVariant) => {
      if (variantMatches(variant, existingVariant)) {
        return { ...existingVariant, ...state };
      }

      return existingVariant;
    });

    component.props.onChange(newVariants);
  },

  transforms,
});

class AdminProductVariantsTable extends React.Component {
  addVariantClicked = () => {
    const position = Math.max(0, ...this.props.product.product_variants
      .map((variant) => variant.position)) + 1;

    this.props.onChange([
      ...this.props.product.product_variants,
      {
        generatedId: new Date().getTime(),
        name: null,
        description: null,
        override_price: null,
        position,
      },
    ]);
  }

  deleteVariantClicked = (variant) => {
    if (variant.id) {
      this.props.deleteVariant(variant.id);
    } else if (variant.generatedId) {
      this.props.onChange(this.props.product.product_variants
        .filter((existingVariant) => existingVariant.generatedId !== variant.generatedId));
    }
  }

  moveVariant = (dragIndex, hoverIndex) => {
    const variants = sortProductVariants(this.props.product.product_variants);
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

    this.props.onChange(newVariants);
  }

  generatePreview = (type, { productVariant, index }, style) => {
    if (type === 'PRODUCT_VARIANT') {
      return (
        <table style={{ ...style, width: `${this.table.offsetWidth}px` }}>
          <AdminProductVariantEditRow
            productId={this.props.product.id}
            index={index}
            variant={productVariant}
            deleteVariant={() => {}}
            updater={{}}
            moveVariant={() => {}}
            isDragging={false}
          />
        </table>
      );
    }

    return null;
  }

  render = () => {
    const addVariantButton = (
      this.props.editing
        ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={this.addVariantClicked}>
            Add variant
          </button>
        )
        : null
    );

    if (this.props.product.product_variants.length === 0) {
      return (
        <div>
          <p>This product does not have any variants.</p>
          {addVariantButton}
        </div>
      );
    }

    let variants;
    if (this.props.editing) {
      variants = this.props.product.product_variants
        .filter((variant) => !this.props.product.delete_variant_ids.includes(variant.id));
    } else {
      variants = this.props.product.product_variants;
    }

    const rows = sortProductVariants(variants).map((variant, index) => {
      if (this.props.editing) {
        const variantUpdater = productVariantUpdaterForComponent(
          this,
          variant,
          {
            name: Transforms.identity,
            description: Transforms.identity,
            override_price: parseMoneyOrNull,
          },
        );

        return (
          <AdminProductVariantEditRow
            index={index}
            key={variant.id || variant.generatedId}
            productId={this.props.product.id || this.props.product.generatedId}
            variant={variant}
            updater={variantUpdater}
            deleteVariant={() => { this.deleteVariantClicked(variant); }}
            moveVariant={this.moveVariant}
          />
        );
      }

      return (
        <tr key={variant.id}>
          <td />
          <td>{variant.name}</td>
          <td>{variant.description}</td>
          <td>{variant.override_price ? formatMoney(variant.override_price) : null}</td>
          <td />
        </tr>
      );
    });

    return (
      <div className="mt-2">
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          <table className="table table-sm" ref={(table) => { this.table = table; }}>
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
        </DndProvider>
        {addVariantButton}

        <Preview generator={this.generatePreview} />
      </div>
    );
  }
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
