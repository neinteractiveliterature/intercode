# frozen_string_literal: true
class ContentCloners::ConventionCloner < ContentCloners::ContentClonerBase
  def clone(convention)
    convention.organization ||= source_convention.organization
    if convention.maximum_event_signups&.timespans.blank?
      convention.maximum_event_signups =
        shift_scheduled_value_by_convention_distance(convention, source_convention.maximum_event_signups)
    end
    convention.save!

    @id_maps[:conventions] = { source_convention.id => convention }
  end
end
