class CmsLayout < ApplicationRecord
  include Cadmus::Layout
  include Concerns::CmsReferences

  has_and_belongs_to_many :cms_files
  has_and_belongs_to_many :cms_partials

  before_commit :set_performance_metadata, on: [:create, :update]

  cadmus_layout

  private

  def set_performance_metadata
    self.cms_file_ids = referenced_files_recursive.map(&:id)
    self.cms_partial_ids = referenced_partials_recursive.map(&:id)
  end
end
