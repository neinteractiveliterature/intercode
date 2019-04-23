class RootSite < ApplicationRecord
  belongs_to :root_page, class_name: 'Page'
  belongs_to :default_layout, class_name: 'CmsLayout'

  def self.instance
    RootSite.first
  end

  def pages
    Page.global
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
end
