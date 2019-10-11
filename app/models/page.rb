class Page < ApplicationRecord
  include Cadmus::Page
  include CmsReferences

  cadmus_page
  belongs_to :cms_layout, optional: true
  has_many :cms_content_group_associations, as: :content
  has_many :cms_content_groups, through: :cms_content_group_associations
  has_and_belongs_to_many :cms_files
  has_and_belongs_to_many :cms_partials

  before_commit :set_performance_metadata, on: [:create, :update]
  after_commit :touch_parent

  def effective_cms_layout
    return cms_layout if cms_layout
    if parent
      parent.default_layout
    else
      RootSite.instance&.default_layout
    end
  end

  def to_liquid
    PageDrop.new(self)
  end

  def referenced_partials_recursive(blacklist = [])
    (super + (effective_cms_layout&.referenced_partials_recursive(blacklist) || [])).uniq
  end

  def referenced_files_recursive
    (super + (effective_cms_layout&.referenced_files_recursive || [])).uniq
  end

  private

  def set_performance_metadata
    self.cms_file_ids = referenced_files_recursive.map(&:id)
    self.cms_partial_ids = referenced_partials_recursive.map(&:id)
    self.invariant = template_invariant?(parent&.cms_variables&.pluck(:key) || [])
  end

  def touch_parent
    parent.touch if parent && parent.persisted?
  end
end
