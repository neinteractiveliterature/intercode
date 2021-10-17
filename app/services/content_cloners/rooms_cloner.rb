# frozen_string_literal: true
class ContentCloners::RoomsCloner < ContentCloners::ContentClonerBase
  def clone(convention)
    @id_maps[:rooms] = clone_with_id_map(source_convention.rooms, convention.rooms)
  end
end
