class CmsLayout < ApplicationRecord
  include Cadmus::Layout
  include CmsReferences

  has_many :cms_content_group_associations, as: :content
  has_many :cms_content_groups, through: :cms_content_group_associations
  has_and_belongs_to_many :cms_files
  has_and_belongs_to_many :cms_partials

  before_commit :set_performance_metadata, on: [:create, :update]
  after_commit :touch_parent

  private

  cadmus_layout

  def set_performance_metadata
    self.cms_file_ids = referenced_files_recursive.map(&:id)
    self.cms_partial_ids = referenced_partials_recursive.map(&:id)
  end

  def touch_parent
    parent.touch if parent && parent.persisted?
  end
end
