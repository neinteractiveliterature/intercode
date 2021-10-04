import { gql } from '@apollo/client';

export const CmsVariableFields = gql`
  fragment CmsVariableFields on CmsVariable {
    id: transitionalId
    key
    value_json
    current_ability_can_update
    current_ability_can_delete
  }
`;

export const CmsVariablesQuery = gql`
  query CmsVariablesQuery {
    cmsParent: cmsParentByRequestHost {
      id: transitionalId
      cmsVariables {
        id: transitionalId
        ...CmsVariableFields
      }
    }

    currentAbility {
      can_create_cms_variables
    }
  }

  ${CmsVariableFields}
`;

export const SetCmsVariableMutation = gql`
  mutation SetCmsVariableMutation($key: String!, $value_json: String!) {
    setCmsVariable(input: { cms_variable: { key: $key, value_json: $value_json } }) {
      cms_variable {
        id: transitionalId
        ...CmsVariableFields
      }
    }
  }

  ${CmsVariableFields}
`;

export const DeleteCmsVariableMutation = gql`
  mutation DeleteCmsVariableMutation($key: String!) {
    deleteCmsVariable(input: { key: $key }) {
      cms_variable {
        id: transitionalId
        ...CmsVariableFields
      }
    }
  }

  ${CmsVariableFields}
`;
