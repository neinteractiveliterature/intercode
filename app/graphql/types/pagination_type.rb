# frozen_string_literal: true
class Types::PaginationType < Types::BaseObject
  description "One page of a longer list of results"
  implements Types::PaginationInterface

  def self.resolve_entries(object, _context)
    object.to_a
  end

  def self.entries_field(entry_type)
    field :entries, [entry_type], null: false, resolve_each: :resolve_entries, description: "The results on this page"

    define_method :entries do
      self.class.resolve_entries(object, context)
    end
  end
end
