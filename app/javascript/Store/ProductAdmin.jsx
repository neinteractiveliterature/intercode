import React from 'react';
import { graphql } from 'react-apollo';
import AdminProductCard from './AdminProductCard';
import { AdminProductsQuery } from './queries.gql';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';

@graphql(AdminProductsQuery)
@GraphQLQueryResultWrapper
class ProductAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(AdminProductsQuery).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      newProducts: [],
    };
  }

  newProductClicked = () => {
    this.setState(prevState => ({
      newProducts: [
        ...prevState.newProducts,
        {
          generatedId: new Date().getTime(),
          name: '',
          description: '',
          image_url: null,
          price: null,
          product_variants: [],
          available: true,
        },
      ],
    }));
  }

  removeNewProduct = (product) => {
    this.setState(prevState => ({
      newProducts: prevState.newProducts
        .filter(newProduct => newProduct.generatedId !== product.generatedId),
    }));
  }

  renderProduct = product => (
    <AdminProductCard
      key={product.id || product.generatedId}
      product={product}
      initialEditing={product.id == null}
      currentAbility={this.props.data.currentAbility}
      onSaveNewProduct={this.removeNewProduct}
      onCancelNewProduct={this.removeNewProduct}
    />
  )

  render = () => {
    const products = [...this.props.data.convention.products]
      .sort((a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' }))
      .concat(this.state.newProducts)
      .map(product => this.renderProduct(product));

    return (
      <div>
        {products}
        <div className="my-4">
          {
            this.props.data.currentAbility.can_update_products
              ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.newProductClicked}
                >
                  New product
                </button>
              )
              : null
          }
        </div>
      </div>
    );
  }
}

export default ProductAdmin;
