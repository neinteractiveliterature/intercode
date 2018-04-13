import React from 'react';
import { graphql } from 'react-apollo';
import AdminProductCard from './AdminProductCard';
import { productsQuery } from './queries';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';

@graphql(productsQuery)
@GraphQLQueryResultWrapper
class ProductAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(productsQuery).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      newProducts: [],
    };
  }

  newProductClicked = () => {
    this.setState({
      newProducts: [
        ...this.state.newProducts,
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
    });
  }

  removeNewProduct = (product) => {
    const newProducts = this.state.newProducts
      .filter(newProduct => newProduct.generatedId !== product.generatedId);

    this.setState({ newProducts });
  }

  renderProduct = product => (
    <AdminProductCard
      key={product.id || product.generatedId}
      product={product}
      initialEditing={product.id == null}
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
          <button className="btn btn-primary" onClick={this.newProductClicked}>New product</button>
        </div>
      </div>
    );
  }
}

export default ProductAdmin;
