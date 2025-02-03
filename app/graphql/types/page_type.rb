# frozen_string_literal: true
class Types::PageType < Types::BaseObject
  description "A CMS page, viewable at a location under `/pages/`."

  field :admin_notes, String, null: true do
    authorize_action :update
    description "Notes on this page that will be visible to site admins"
  end
  field :cms_layout, Types::CmsLayoutType, null: true do
    description <<~MARKDOWN
    If present, the layout to use for rendering this page.  If not, this page will use the default layout for its CMS
    parent.
    MARKDOWN
  end
  field :content, String, null: true, description: "The content of this page, in Liquid format"
  field :content_html, String, null: false, description: "The rendered content of this page, in HTML format"
  field :current_ability_can_delete,
        Boolean,
        null: false,
        description: "Is the user making this request allowed to delete this page?"
  field :current_ability_can_update, # rubocop:disable GraphQL/ExtractType
        Boolean,
        null: false,
        description: "Is the user making this request allowed to update this page?"
  field :hidden_from_search,
        Boolean,
        null: false,
        description: "If true, this page will not be indexed for full-text search."
  field :id, ID, null: false, description: "The ID of this page."
  field :meta_description, String, null: true do
    description <<~MARKDOWN
    If present, this value will be used in the `<meta property="og:description">` and
    `<meta name="description">` tags in the `<head>` of this page, which are used as the
    preview text for links to this page on web sites such as Facebook, Twitter, etc.

    If absent, the description text will be automatically generated from the page content.
    MARKDOWN
  end
  field :name, String, null: true, description: "The title of this page"
  field :referenced_partials, [Types::CmsPartialType], null: false, method: :referenced_partials_recursive do
    description <<~MARKDOWN
    An automatically-generated list of CMS partials referenced by this page (and any partials referenced by those, etc.)
    MARKDOWN
  end
  field :skip_clickwrap_agreement, Boolean, null: true do
    description <<~MARKDOWN
    If true, this page will not require the user to agree to the site's clickwrap agreement (if applicable) in order to
    view it.  This should be used on any pages referenced in the clickwrap agreement, such as site policies.
    MARKDOWN
  end
  field :slug, String, null: true, description: "The URL portion after `/pages/` at which this page can be viewed"

  def content_html
    dataloader.with(Sources::CmsPageContent, cms_rendering_context_for_cms_parent(object.parent)).load(object)
  end

  def current_ability_can_update
    dataloader.with(Sources::ModelPermission, Page, [:parent]).load([pundit_user, :update, object.id])
  end

  def current_ability_can_delete
    dataloader.with(Sources::ModelPermission, Page, [:parent]).load([pundit_user, :destroy, object.id])
  end
end
