# frozen_string_literal: true
module Types::CmsParent
  include Types::BaseInterface
  field_class Types::BaseField

  definition_methods do
    def resolve_type(object, _context)
      case object
      when RootSite
        Types::RootSiteType
      when Convention
        Types::ConventionType
      end
    end
  end

  description <<~MARKDOWN
    A CMS parent is a web site managed by Intercode. It acts as a container for CMS content, such
    as pages, partials, files, layouts, variables, content groups, and user-defined GraphQL queries.

    Most CMS parents are conventions, so their content will be convention-specific and scoped to
    that convention's domain name. The exception to this is the root site, which is what Intercode
    renders when there is no convention associated with the current domain name. (See the RootSite
    object for more details about this.)
  MARKDOWN

  field :id, ID, null: false, description: "The ID of this object."

  field :cms_content_groups, [Types::CmsContentGroupType], null: false do
    description <<~MARKDOWN
    Returns all CMS content groups within the current domain.
  MARKDOWN
  end

  field :cms_content_group, Types::CmsContentGroupType, null: false do
    argument :id, ID, required: true, description: "The ID of the CMS content group to find."

    description <<~MARKDOWN
      Finds a CMS content group by ID within the domain name of this HTTP request. If there is no
      CMS content group with that ID, or the CMS content group is associated with a different
      domain name, errors out.
    MARKDOWN
  end

  field :cms_files, [Types::CmsFileType], null: false do
    description <<~MARKDOWN
    Returns all CMS files within the current domain.
  MARKDOWN
  end

  field :cms_pages, [Types::PageType], null: false, method: :pages do
    description <<~MARKDOWN
    Returns all CMS pages within the current domain.
  MARKDOWN
  end

  field :cms_page, Types::PageType, null: false do
    argument :id, ID, required: false, description: "The ID of the page to find."
    argument :slug, String, required: false, description: "The unique slug of the page to find."
    argument :root_page, Boolean, required: false, description: "If true, returns the root page for this domain."

    description <<~MARKDOWN
      Finds a CMS page within the domain name of this HTTP request. Exactly one of the three
      optional arguments (`id`, `slug`, and `rootPage`) must be specified. These each represent a
      different way of finding a page. If the desired page can't be found within the current
      domain name, errors out.
    MARKDOWN
  end

  field :cms_layouts, [Types::CmsLayoutType], null: false do
    description <<~MARKDOWN
    Returns all CMS layouts within the current domain.
  MARKDOWN
  end

  field :cms_layout, Types::CmsLayoutType, null: false do
    description "Finds a CMS layout by ID."
    argument :id, ID, required: true, description: "The ID of the CMS layout to find."
  end

  field :cms_partials, [Types::CmsPartialType], null: false do
    description <<~MARKDOWN
    Returns all CMS partials within the current domain.
  MARKDOWN
  end

  field :cms_partial, Types::CmsPartialType, null: false do
    description "Finds a CMS partial by ID."
    argument :id, ID, required: true, description: "The ID of the CMS partial to find."
  end

  field :cms_variables, [Types::CmsVariable], null: false do
    description <<~MARKDOWN
    Returns all CMS variables within the current domain.
  MARKDOWN
  end

  field :cms_graphql_queries, [Types::CmsGraphqlQueryType], null: false do
    description <<~MARKDOWN
    Returns all CMS GraphQL queries within the current domain.
  MARKDOWN
  end

  field :cms_navigation_items, [Types::CmsNavigationItemType], null: false do
    description <<~MARKDOWN
    Returns all CMS navigation items within the current domain.
  MARKDOWN
  end

  field :default_layout, Types::CmsLayoutType, null: false do
    description <<~MARKDOWN
      Returns the default CMS layout used in this domain.
    MARKDOWN
  end

  field :effective_cms_layout, Types::CmsLayoutType, null: false do
    argument :path, String, required: true, description: "The path to find the effective layout for."

    description <<~MARKDOWN
      Returns the CMS layout to be used for a particular URL path within the current domain. (This
      will be the page-specific layout if the URL corresponds to a page with a layout override, or
      the default layout for the domain otherwise.)
    MARKDOWN
  end

  field :full_text_search, Types::SearchResultType, null: false do
    argument :query, String, required: true, description: "The text to search for."

    description <<~MARKDOWN
    Does a full-text search within this domain.
  MARKDOWN
  end

  field :liquid_assigns, [Types::LiquidAssign], null: false do
    description <<~MARKDOWN
      Returns all the Liquid assigns for regular CMS page rendering in the current domain name.
      This is a combination of globally-accessible Liquid assigns and domain-specific user-defined
      CMS variables.
    MARKDOWN
  end

  field :block_partial, Types::CmsPartialType, null: true do
    description "Returns the content block partial for the given content block name"

    argument :name, Types::CmsPartialBlockName, required: true, description: "The name of the content block"
  end

  field :preview_markdown, String, null: false do
    argument :markdown, String, required: true, description: "The Markdown content to render."
    argument :event_id,
             ID,
             required: false,
             description: "The event ID that this Markdown will apply to, if applicable."
    argument :event_proposal_id,
             ID,
             required: false,
             description: "The event proposal ID that this Markdown will apply to, if applicable."

    description <<~MARKDOWN
    Given a Markdown text string, renders it to HTML and returns the result.
  MARKDOWN
  end

  field :preview_liquid, String, null: false do
    argument :content, String, required: true, description: "The Liquid content to render."

    description <<~MARKDOWN
    Given a Liquid text string, renders it to HTML and returns the result.
  MARKDOWN

    authorize do |object, _args, context|
      # TODO maybe better permission for this?  Not sure, but for now I'm using view_reports as a
      # proxy for "privileged enough to preview arbitrary Liquid (and therefore access arbitrary
      # Liquid drop data)"
      if object.is_a?(Convention)
        Pundit.policy(context[:pundit_user], object).view_reports?
      else
        context[:current_user].site_admin?
      end
    end
  end

  field :root_page, Types::PageType, null: false do
    description "The CMS page used for the root path (/) of this domain."
  end

  field :typeahead_search_cms_content, [Types::CmsContentType], null: false do
    argument :name,
             String,
             required: false,
             description:
               "The partial name to search by.  If not specified, returns all CMS content \
within the current domain (limited to 10 results)."

    description <<~MARKDOWN
      Finds CMS content by partial name, case-insensitive, within the current domain's CMS content.
      For example, in a convention that has a partial called `attendee_profile` and a page called
      `info_for_attendees`, a search for `attendee` would return both of these.

      This query is always limited to a maximum of 10 results.
    MARKDOWN
  end
end
