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
