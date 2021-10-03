# frozen_string_literal: true
class Types::CmsContentTypeIndicator < Types::BaseEnum
  Types::CmsContentType.possible_types.each { |possible_type| value possible_type.graphql_name }
end
