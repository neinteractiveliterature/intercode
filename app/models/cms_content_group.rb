class CmsContentGroup < ApplicationRecord
  include Cadmus::Concerns::ModelWithParent
  model_with_parent
  after_commit :touch_parent

  has_many :cms_content_group_associations
  has_many :contents, through: :cms_content_group_associations
  has_many :permissions, dependent: :destroy
end
