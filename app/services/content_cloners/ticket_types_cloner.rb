# frozen_string_literal: true
class ContentCloners::TicketTypesCloner < ContentCloners::ContentClonerBase
  def clone(convention)
    @id_maps[:ticket_types] = clone_with_id_map(source_convention.ticket_types, convention.ticket_types)
  end
end
