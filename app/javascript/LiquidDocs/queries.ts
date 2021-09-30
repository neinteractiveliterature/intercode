import { gql } from '@apollo/client';

export const LiquidAssignFields = gql`
  fragment LiquidAssignFields on LiquidAssign {
    name
    drop_class_name
    cms_variable_value_json
  }
`;

export const LiquidAssignsQuery = gql`
  query LiquidAssignsQuery {
    cmsParent: cmsParentByRequestHost {
      liquidAssigns {
        ...LiquidAssignFields
      }
    }
  }

  ${LiquidAssignFields}
`;

export const NotifierLiquidAssignsQuery = gql`
  query NotifierLiquidAssignsQuery($eventKey: String!) {
    cmsParent: conventionByRequestHost {
      id
      liquidAssigns: notifier_liquid_assigns(eventKey: $eventKey) {
        ...LiquidAssignFields
      }
    }
  }

  ${LiquidAssignFields}
`;
