class FormSection < ApplicationRecord
  belongs_to :form
  has_many :form_items, dependent: :destroy

  acts_as_list scope: :form
end
