# == Schema Information
#
# Table name: cms_variables
#
#  id          :bigint           not null, primary key
#  key         :string(100)      not null
#  parent_type :string
#  value       :jsonb
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :bigint
#
# Indexes
#
#  index_cms_variables_on_parent_id          (parent_id)
#  index_cms_variables_on_parent_id_and_key  (parent_id,key) UNIQUE
#
# A convention-specific variable.  To set the values of these variables, go to Admin -> Site
# Content -> Variables.
class CmsVariable < ApplicationRecord
  include Cadmus::Concerns::ModelWithParent
  model_with_parent
  after_commit :touch_parent

  validates :key, presence: true
  validates :key, format: { with: /\A[a-z]\w*\z/ }
  validates :key, uniqueness: { scope: [:parent_type, :parent_id] }

  # @api
  def to_liquid
    value
  end

  private

  def touch_parent
    parent.touch if parent && parent.persisted?
  end
end
