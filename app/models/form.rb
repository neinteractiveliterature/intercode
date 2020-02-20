class Form < ApplicationRecord
  FORM_TYPE_CONFIG = JSON.parse(File.read(File.expand_path('config/form_types.json', Rails.root)))

  belongs_to :convention
  has_many :form_sections, dependent: :destroy
  has_many :form_items, through: :form_sections

  has_many :event_categories,
    class_name: 'EventCategory', foreign_key: 'event_form_id', dependent: :nullify
  has_many :proposal_event_categories,
    class_name: 'EventCategory', foreign_key: 'event_proposal_form_id', dependent: :nullify
  has_many :user_con_profile_conventions,
    class_name: 'Convention', foreign_key: 'user_con_profile_form_id', dependent: :nullify

  validates :form_type, inclusion: { in: FORM_TYPE_CONFIG.keys }
end
