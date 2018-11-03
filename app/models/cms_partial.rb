class CmsPartial < ApplicationRecord
  include Cadmus::Partial
  include Concerns::CmsReferences

  before_commit :set_performance_metadata, on: [:create, :update]

  cadmus_partial

  private

  def set_performance_metadata
    self.invariant = template_invariant?
  end
end
