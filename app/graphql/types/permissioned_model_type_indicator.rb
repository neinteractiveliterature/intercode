# frozen_string_literal: true
class Types::PermissionedModelTypeIndicator < Types::BaseEnum
  Types::PermissionedModelType.possible_types.each { |possible_type| value possible_type.graphql_name }
end
