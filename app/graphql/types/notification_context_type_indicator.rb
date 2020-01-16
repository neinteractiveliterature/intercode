class Types::NotificationContextTypeIndicator < Types::BaseEnum
  Types::CmsContentType.possible_types.each do |possible_type|
    value possible_type.graphql_name
  end
end
