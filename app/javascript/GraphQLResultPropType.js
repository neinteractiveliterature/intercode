import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';

export function GraphQLFieldPropType(query, rootKey) {
  return (props) => {
    if (!props.loading) {
      return propType(query)(props[rootKey]);
    }

    return undefined;
  };
}

function GraphQLResultPropType(query, ...fields) {
  const fieldProps = Object.assign(
    {},
    ...fields.map(fieldName => ({ [fieldName]: GraphQLFieldPropType(query, fieldName) })),
  );

  return PropTypes.shape({
    ...fieldProps,
    loading: PropTypes.boolean,
    error: PropTypes.object,
  });
}

export default GraphQLResultPropType;
