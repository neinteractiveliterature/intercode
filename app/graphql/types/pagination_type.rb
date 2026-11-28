# frozen_string_literal: true
class Types::PaginationType < Types::BaseObject
  description "One page of a longer list of results"
  implements Types::PaginationInterface

  def self.entries_field(entry_type)
    field :entries, [entry_type], null: false, description: "The results on this page"

    define_method :entries do
      object.to_a
    end
  end
end
