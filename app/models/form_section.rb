class FormSection < ApplicationRecord
  belongs_to :form
  has_many :form_items

  acts_as_list scope: :form
end
