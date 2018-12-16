class CmsGraphqlQueriesController < ApplicationController
  authorize_resource :cms_graphql_queries

  layout 'cms_admin'

  def index
  end
end
