# frozen_string_literal: true
# rubocop:disable Layout/LineLength, Lint/RedundantCopDisableDirective
# == Schema Information
#
# Table name: event_categories
#
#  id                     :bigint           not null, primary key
#  can_provide_tickets    :boolean          default(FALSE), not null
#  default_color          :text             not null
#  full_color             :text             not null
#  name                   :text             not null
#  proposal_description   :text
#  scheduling_ui          :text             not null
#  signed_up_color        :text             not null
#  team_member_name       :text             not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  convention_id          :bigint           not null
#  department_id          :bigint
#  event_form_id          :bigint           not null
#  event_proposal_form_id :bigint
#
# Indexes
#
#  index_event_categories_on_convention_id           (convention_id)
#  index_event_categories_on_department_id           (department_id)
#  index_event_categories_on_event_form_id           (event_form_id)
#  index_event_categories_on_event_proposal_form_id  (event_proposal_form_id)
#
# Foreign Keys
#
#  fk_rails_...  (convention_id => conventions.id)
#  fk_rails_...  (department_id => departments.id)
#  fk_rails_...  (event_form_id => forms.id)
#  fk_rails_...  (event_proposal_form_id => forms.id)
#
# rubocop:enable Layout/LineLength, Lint/RedundantCopDisableDirective
# rubocop:disable Metrics/LineLength, Lint/RedundantCopDisableDirective
class EventCategory < ApplicationRecord
  SCHEDULING_UIS = Set.new(%w[regular recurring single_run])

  belongs_to :convention
  belongs_to :department, optional: true
  belongs_to :event_form, class_name: 'Form'
  belongs_to :event_proposal_form, class_name: 'Form', optional: true
  has_many :permissions, dependent: :destroy
  has_many :events

  validates :name, :team_member_name, presence: true
  validates :scheduling_ui, inclusion: { in: SCHEDULING_UIS }
  validate :ensure_department_in_convention

  SCHEDULING_UIS.each do |scheduling_ui|
    define_method "#{scheduling_ui}?" do
      self.scheduling_ui == scheduling_ui
    end
  end

  def proposable?
    event_proposal_form.present?
  end

  def to_liquid
    EventCategoryDrop.new(self)
  end

  private

  def ensure_department_in_convention
    return unless department && convention
    return if department.convention == convention

    errors.add :department, "is not part of #{convention.name}"
  end
end
