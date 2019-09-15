class CmsContentGroupAssociation < ApplicationRecord
  belongs_to :content, polymorphic: true
  belongs_to :cms_content_group
end
