# frozen_string_literal: true
class ContentCloners::ConventionCloner < ContentCloners::ContentClonerBase
  def clone(convention)
    convention.organization ||= source_convention.organization
    convention.save!

    @id_maps[:conventions] = { source_convention.id => convention }
  end
end
