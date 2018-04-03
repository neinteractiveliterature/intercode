import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import GraphQLQueryResultWrapper from '../GraphQLQueryResultWrapper';
import GraphQLResultPropType from '../GraphQLResultPropType';

const productsQuery = gql`
query {
  convention {
    products {
      id
      name
      description
      image_url
      available

      price {
        fractional
        currency_code
      }

      product_variants {
        id
        name
        description
        image_url

        override_price {
          fractional
          currency_code
        }
      }
    }
  }
}
`;

@graphql(productsQuery)
@GraphQLQueryResultWrapper
class ProductAdmin extends React.Component {
  static propTypes = {
    data: GraphQLResultPropType(productsQuery).isRequired,
  }

  renderProduct = product => (
    <div key={product.id}>
      <h2>{product.name}</h2>
      
    </div>
  )

  render = () => {
    const products = this.props.data.convention.products
      .map(product => this.renderProduct(product));

    return (
      <div>
        {products}
      </div>
    );
  }
}

export default ProductAdmin;
