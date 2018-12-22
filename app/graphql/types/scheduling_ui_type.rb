class Types::SchedulingUiType < Types::BaseEnum
  EventCategory::SCHEDULING_UIS.each do |scheduling_ui|
    value(scheduling_ui)
  end
end
