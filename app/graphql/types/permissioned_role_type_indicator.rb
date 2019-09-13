class Types::PermissionedRoleTypeIndicator < Types::BaseEnum
  Types::PermissionedRoleType.possible_types.each do |possible_type|
    value possible_type.graphql_name
  end
end
