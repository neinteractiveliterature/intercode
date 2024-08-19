/* eslint-disable */
import * as Types from '../graphqlTypes.generated';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateTicketTypeMutationVariables = Types.Exact<{
  input: Types.CreateTicketTypeInput;
}>;


export type CreateTicketTypeMutationData = { __typename: 'Mutation', createTicketType: { __typename: 'CreateTicketTypePayload', ticket_type: { __typename: 'TicketType', id: string, name: string, description?: string | null, counts_towards_convention_maximum: boolean, allows_event_signups: boolean, maximum_event_provided_tickets: number, providing_products: Array<{ __typename: 'Product', id: string, name: string, available: boolean, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', allowed_currency_codes?: Array<string> | null, maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } }> } } };

export type UpdateTicketTypeMutationVariables = Types.Exact<{
  input: Types.UpdateTicketTypeInput;
}>;


export type UpdateTicketTypeMutationData = { __typename: 'Mutation', updateTicketType: { __typename: 'UpdateTicketTypePayload', ticket_type: { __typename: 'TicketType', id: string, name: string, description?: string | null, counts_towards_convention_maximum: boolean, allows_event_signups: boolean, maximum_event_provided_tickets: number, providing_products: Array<{ __typename: 'Product', id: string, name: string, available: boolean, pricing_structure: { __typename: 'PricingStructure', pricing_strategy: Types.PricingStrategy, price?: { __typename: 'Money', fractional: number, currency_code: string } | null, value: { __typename: 'Money', fractional: number, currency_code: string } | { __typename: 'PayWhatYouWantValue', allowed_currency_codes?: Array<string> | null, maximum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, minimum_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null, suggested_amount?: { __typename: 'Money', currency_code: string, fractional: number } | null } | { __typename: 'ScheduledMoneyValue', timespans: Array<{ __typename: 'TimespanWithMoneyValue', start?: string | null, finish?: string | null, value: { __typename: 'Money', fractional: number, currency_code: string } }> } } }> } } };

export type DeleteTicketTypeMutationVariables = Types.Exact<{
  input: Types.DeleteTicketTypeInput;
}>;


export type DeleteTicketTypeMutationData = { __typename: 'Mutation', deleteTicketType: { __typename: 'DeleteTicketTypePayload', ticket_type: { __typename: 'TicketType', id: string } } };


export const CreateTicketTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTicketType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTicketTypeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTicketType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ticket_type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketTypeAdmin_TicketTypeFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PricingStructureFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PricingStructure"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pricing_strategy"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fractional"}},{"kind":"Field","name":{"kind":"Name","value":"currency_code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Money"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fractional"}},{"kind":"Field","name":{"kind":"Name","value":"currency_code"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ScheduledMoneyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timespans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"finish"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fractional"}},{"kind":"Field","name":{"kind":"Name","value":"currency_code"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PayWhatYouWantValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maximum_amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currency_code"}},{"kind":"Field","name":{"kind":"Name","value":"fractional"}}]}},{"kind":"Field","name":{"kind":"Name","value":"minimum_amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currency_code"}},{"kind":"Field","name":{"kind":"Name","value":"fractional"}}]}},{"kind":"Field","name":{"kind":"Name","value":"suggested_amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currency_code"}},{"kind":"Field","name":{"kind":"Name","value":"fractional"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allowed_currency_codes"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketTypeAdmin_TicketTypeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"counts_towards_convention_maximum"}},{"kind":"Field","name":{"kind":"Name","value":"allows_event_signups"}},{"kind":"Field","name":{"kind":"Name","value":"maximum_event_provided_tickets"}},{"kind":"Field","name":{"kind":"Name","value":"providing_products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"pricing_structure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PricingStructureFields"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTicketTypeMutationData, CreateTicketTypeMutationVariables>;
export const UpdateTicketTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTicketType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTicketTypeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTicketType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ticket_type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TicketTypeAdmin_TicketTypeFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PricingStructureFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PricingStructure"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pricing_strategy"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fractional"}},{"kind":"Field","name":{"kind":"Name","value":"currency_code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Money"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fractional"}},{"kind":"Field","name":{"kind":"Name","value":"currency_code"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ScheduledMoneyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timespans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"finish"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fractional"}},{"kind":"Field","name":{"kind":"Name","value":"currency_code"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PayWhatYouWantValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maximum_amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currency_code"}},{"kind":"Field","name":{"kind":"Name","value":"fractional"}}]}},{"kind":"Field","name":{"kind":"Name","value":"minimum_amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currency_code"}},{"kind":"Field","name":{"kind":"Name","value":"fractional"}}]}},{"kind":"Field","name":{"kind":"Name","value":"suggested_amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currency_code"}},{"kind":"Field","name":{"kind":"Name","value":"fractional"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allowed_currency_codes"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TicketTypeAdmin_TicketTypeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TicketType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"counts_towards_convention_maximum"}},{"kind":"Field","name":{"kind":"Name","value":"allows_event_signups"}},{"kind":"Field","name":{"kind":"Name","value":"maximum_event_provided_tickets"}},{"kind":"Field","name":{"kind":"Name","value":"providing_products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"pricing_structure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PricingStructureFields"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTicketTypeMutationData, UpdateTicketTypeMutationVariables>;
export const DeleteTicketTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTicketType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteTicketTypeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTicketType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ticket_type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTicketTypeMutationData, DeleteTicketTypeMutationVariables>;