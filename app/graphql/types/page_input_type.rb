# frozen_string_literal: true
class Types::PageInputType < Types::BaseInputObject
  description "A CMS page."

  argument :admin_notes, String, required: false, camelize: false do
    description "Notes on this page that will be visible to site admins"
  end
  argument :cms_layout_id, ID, required: false, camelize: true do
    description <<~MARKDOWN
    If present, the ID of the layout to use for rendering this page.  If not, this page will use the default layout for
    its CMS parent.
    MARKDOWN
  end
  argument :content, String, required: false, description: "The content of this page, in Liquid format"
  argument :hidden_from_search,
           Boolean,
           required: false,
           camelize: false,
           description: "If true, this page will not be indexed for full-text search."
  argument :meta_description, String, required: false do
    description <<~MARKDOWN
    If present, this value will be used in the `<meta property="og:description">` and
    `<meta name="description">` tags in the `<head>` of this page, which are used as the
    preview text for links to this page on web sites such as Facebook, Twitter, etc.

    If absent, the description text will be automatically generated from the page content.
    MARKDOWN
  end
  argument :name, String, required: false, description: "The title of this page"
  argument :skip_clickwrap_agreement, Boolean, required: false, camelize: false do
    description <<~MARKDOWN
    If true, this page will not require the user to agree to the site's clickwrap agreement (if applicable) in order to
    view it.  This should be used on any pages referenced in the clickwrap agreement, such as site policies.
    MARKDOWN
  end
  argument :slug,
           String,
           required: false,
           description: "The URL portion after `/pages/` at which this page can be viewed"
end
