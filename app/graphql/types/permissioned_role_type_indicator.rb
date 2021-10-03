# frozen_string_literal: true
class Types::PermissionedRoleTypeIndicator < Types::BaseEnum
  Types::PermissionedRoleType.possible_types.each { |possible_type| value possible_type.graphql_name }
end
