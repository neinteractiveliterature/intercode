class GraphqlPresendPresenter
  attr_reader :controller, :cms_parent, :path, :context

  APP_ROOT_QUERY, APP_ROOT_LAYOUT_QUERY, CMS_PAGE_QUERY, COMMON_CONVENTION_DATA_QUERY, PAGE_ADMIN_DROPDOWN_QUERY =
    GraphqlOperation.by_name(
      "AppRootQuery",
      "AppRootLayoutQuery",
      "CmsPageQuery",
      "CommonConventionDataQuery",
      "PageAdminDropdownQuery"
    )

  def initialize(controller:, cms_parent:)
    @controller = controller
    @cms_parent = cms_parent
    @context = GraphqlController::Context.new(controller)
    @path = controller.request.path
  end

  def cms_admin?
    return @cms_admin if defined?(@cms_admin)
    @cms_admin ||= PagePolicy::ManageScope.new(controller.send(:pundit_user), cms_parent.pages).resolve.any?
  end

  def queries
    @queries ||=
      case path
      when "/"
        cms_root_queries
      when %r{\A/pages/(.+)\z}
        slug = Regexp.last_match(1)
        cms_page_queries(slug)
      when %r{\A/events}
        events_app_queries
      else
        [non_cms_app_root_query]
      end
  end

  def graphql_presend_data
    multiplex_args =
      queries.map do |query|
        {
          query: query[:operation].to_query_string,
          operation_name: query[:operation].name,
          variables: query[:variables],
          context:
        }
      end

    data = IntercodeSchema.multiplex(multiplex_args)
    queries
      .zip(data)
      .map { |(query, result)| { query: query[:operation].to_document, variables: query[:variables], **result } }
  rescue StandardError => e
    # errors in GraphQL pre-sending aren't fatal, but we want to know they happened
    ErrorReporting.warn(e)
    []
  end

  private

  def cms_root_queries
    queries = [
      { operation: CMS_PAGE_QUERY, variables: { rootPage: true } },
      app_root_query,
      app_root_layout_query(path:)
    ]
    queries << { operation: PAGE_ADMIN_DROPDOWN_QUERY, variables: { id: cms_parent.root_page_id.to_s } } if cms_admin?
    queries
  end

  def cms_page_queries(slug)
    queries = [{ operation: CMS_PAGE_QUERY, variables: { slug: } }, app_root_query, app_root_layout_query(path:)]
    if cms_admin?
      page = cms_parent.pages.find_by(slug:)
      queries << { operation: PAGE_ADMIN_DROPDOWN_QUERY, variables: { id: page.id.to_s } }
    end
    queries
  end

  def app_root_query
    { operation: APP_ROOT_QUERY, variables: {} }
  end

  def app_root_layout_query(path:)
    { operation: APP_ROOT_LAYOUT_QUERY, variables: { path: } }
  end

  def events_app_queries
    [app_root_query, app_root_layout_query(path: "/non_cms_path"), { operation: COMMON_CONVENTION_DATA_QUERY }]
  end
end
