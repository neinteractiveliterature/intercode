class CmsPartial < ApplicationRecord
  include Cadmus::Partial
  include CmsReferences

  has_and_belongs_to_many :pages
  has_many :cms_content_group_associations, as: :content
  has_many :cms_content_groups, through: :cms_content_group_associations
  before_commit :set_performance_metadata, on: [:create, :update]

  cadmus_partial

  private

  def set_performance_metadata
    self.invariant = template_invariant?(parent&.cms_variables&.pluck(:key) || [])
  end
end
