class ContentCloners::ConventionCloner < ContentCloners::ContentClonerBase
  def clone(convention)
    convention.organization ||= source_convention.organization
    convention.maximum_event_signups ||= shift_scheduled_value_by_convention_distance(
      convention,
      source_convention.maximum_event_signups
    )
    convention.save!

    @id_maps[:conventions] = { source_convention.id => convention }
  end
end
