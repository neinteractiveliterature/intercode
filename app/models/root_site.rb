class RootSite < ApplicationRecord
  belongs_to :root_page, class_name: 'Page'
  belongs_to :default_layout, class_name: 'CmsLayout'

  def self.instance
    RootSite.first
  end
end
