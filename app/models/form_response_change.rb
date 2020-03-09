class FormResponseChange < ApplicationRecord
  belongs_to :response, polymorphic: true
  belongs_to :user_con_profile

  scope :not_notified, -> { where(notified_at: nil) }
  scope :compacted, -> { where(compacted: true) }
  scope :not_compacted, -> { where(compacted: false) }
end
