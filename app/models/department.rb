class Department < ApplicationRecord
  belongs_to :convention
  has_many :event_categories, dependent: :nullify
end
