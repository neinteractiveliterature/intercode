class EventCategory < ApplicationRecord
  SCHEDULING_UIS = Set.new(%w[regular recurring single_run])

  belongs_to :convention
  belongs_to :event_form, class_name: 'Form'
  belongs_to :event_proposal_form, class_name: 'Form', optional: true

  validates :scheduling_ui, inclusion: { in: SCHEDULING_UIS }

  SCHEDULING_UIS.each do |scheduling_ui|
    define_method "#{scheduling_ui}?" do
      self.scheduling_ui == scheduling_ui
    end
  end

  def to_liquid
    EventCategoryDrop.new(self)
  end
end
