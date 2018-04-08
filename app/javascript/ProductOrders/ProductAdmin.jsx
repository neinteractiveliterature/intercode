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

  renderProduct = product => (
    <AdminProductCard key={product.id} product={product} />
  )

  render = () => {
    const products = [...this.props.data.convention.products]
      .sort((a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' }))
      .map(product => this.renderProduct(product));

    return (
      <div>
        {products}
      </div>
    );
  }
}

export default ProductAdmin;
