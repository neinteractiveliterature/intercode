# frozen_string_literal: true
class Types::SchedulingUiType < Types::BaseEnum
  EventCategory::SCHEDULING_UIS.each { |scheduling_ui| value(scheduling_ui) }
end
