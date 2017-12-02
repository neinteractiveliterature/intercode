import { propType } from 'graphql-anywhere';

export default function GraphQLResultPropType(query) {
  const queryPropType = propType(query);

  const checkType = (isRequired, props, propName, ...args) => {
    if (props[propName].loading) {
      return null;
    }

    let graphQLPropType = queryPropType;
    if (isRequired) {
      graphQLPropType = graphQLPropType.isRequired;
    }

    return graphQLPropType(props, propName, ...args);
  };

  const chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}
