class RootSite < ApplicationRecord
  belongs_to :root_page, class_name: 'Page'
  belongs_to :default_layout, class_name: 'CmsLayout'

  def self.instance
    RootSite.first
  end

  def pages
    Page.global
  end

  def cms_content_groups
    CmsContentGroup.global
  end

  def cms_layouts
    CmsLayout.global
  end

  def cms_partials
    CmsPartial.global
  end

  def cms_variables
    CmsVariable.global
  end

  def cms_files
    CmsFile.global
  end

  def cms_navigation_items
    CmsNavigationItem.global
  end

  def cms_graphql_queries
    CmsGraphqlQuery.global
  end

  def host
    Rails.application.config.action_mailer.default_url_options[:host]
  end

  def url
    Rails.application.routes.url_helpers.root_url(
      Rails.application.config.action_mailer.default_url_options
    )
  end
end
