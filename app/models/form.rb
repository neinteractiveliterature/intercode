# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: forms
#
#  id            :bigint           not null, primary key
#  form_type     :string           not null
#  title         :text
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  convention_id :bigint
#
# Indexes
#
#  index_forms_on_convention_id  (convention_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
class Form < ApplicationRecord
  FORM_TYPE_CONFIG = JSON.parse(File.read(File.expand_path('config/form_types.json', Rails.root)))

  belongs_to :convention
  has_many :form_sections, dependent: :destroy
  has_many :form_items, through: :form_sections

  has_many :event_categories, class_name: 'EventCategory', foreign_key: 'event_form_id', dependent: :nullify
  has_many :proposal_event_categories,
           class_name: 'EventCategory',
           foreign_key: 'event_proposal_form_id',
           dependent: :nullify
  has_many :user_con_profile_conventions,
           class_name: 'Convention',
           foreign_key: 'user_con_profile_form_id',
           dependent: :nullify

  validates :form_type, inclusion: { in: FORM_TYPE_CONFIG.keys }
end
