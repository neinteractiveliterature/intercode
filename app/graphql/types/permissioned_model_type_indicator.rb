class Types::PermissionedModelTypeIndicator < Types::BaseEnum
  Types::PermissionedModelType.possible_types.each do |possible_type|
    value possible_type.graphql_name
  end
end
