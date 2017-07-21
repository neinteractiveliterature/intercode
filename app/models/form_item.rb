class FormItem < ApplicationRecord
  belongs_to :form_section
  has_one :form, through: :form_section
  acts_as_list scope: :form_section

  serialize :properties, JSON
end
