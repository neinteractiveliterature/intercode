# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: departments
#
#  id                   :bigint           not null, primary key
#  name                 :text
#  proposal_description :text
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  convention_id        :bigint           not null
#
# Indexes
#
#  index_departments_on_convention_id  (convention_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective

class Department < ApplicationRecord
  belongs_to :convention
  has_many :event_categories, dependent: :nullify
end
