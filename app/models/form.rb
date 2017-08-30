class Form < ApplicationRecord
  belongs_to :convention
  has_many :form_sections
  has_many :form_items, through: :form_sections
end
