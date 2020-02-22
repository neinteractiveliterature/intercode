class CmsContentGroup < ApplicationRecord
  include Cadmus::Concerns::ModelWithParent

  model_with_parent
  after_commit :touch_parent

  has_many :cms_content_group_associations, dependent: :destroy
  has_many :pages, through: :cms_content_group_associations,
    source: :content, source_type: 'Page'
  has_many :cms_partials, through: :cms_content_group_associations,
    source: :content, source_type: 'CmsPartial'
  has_many :cms_layouts, through: :cms_content_group_associations,
    source: :content, source_type: 'CmsLayout'
  has_many :permissions, dependent: :destroy

  def touch_parent
    parent.touch if parent && parent.persisted?
  end
end
