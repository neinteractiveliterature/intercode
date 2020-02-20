# A convention-specific variable.  To set the values of these variables, go to Admin -> Site
# Content -> Variables.
class CmsVariable < ApplicationRecord
  include Cadmus::Concerns::ModelWithParent
  model_with_parent
  after_commit :touch_parent

  validates :key, presence: true
  validates :key, format: { with: /\A[a-z]\w*\z/ }
  validates :key, uniqueness: { scope: [:parent_type, :parent_id] }

  serialize :value, JSON

  # @api
  def to_liquid
    value
  end

  private

  def touch_parent
    parent.touch if parent && parent.persisted?
  end
end
