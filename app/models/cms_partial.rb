class CmsPartial < ApplicationRecord
  belongs_to :convention

  validates :convention, presence: true
  validates :identifier, uniqueness: { scope: 'convention_id' }, presence: true
end
