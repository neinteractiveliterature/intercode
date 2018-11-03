class Page < ApplicationRecord
  include Cadmus::Page
  include Concerns::CmsReferences

  cadmus_page
  belongs_to :cms_layout, optional: true
  has_and_belongs_to_many :cms_files
  has_and_belongs_to_many :cms_partials

  before_commit :set_performance_metadata, on: [:create, :update]

  def effective_cms_layout
    cms_layout || parent&.default_layout
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
end
