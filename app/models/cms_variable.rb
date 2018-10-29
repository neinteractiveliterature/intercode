# A convention-specific variable.  To set the values of these variables, go to Admin -> Site
# Content -> Variables.
class CmsVariable < ApplicationRecord
  belongs_to :convention

  validates_presence_of :key
  validates_format_of :key, with: /\A[a-z]\w*\z/
  validates_uniqueness_of :key, scope: :convention_id

  serialize :value, JSON

  # @api
  def to_liquid
    value
  end
end
