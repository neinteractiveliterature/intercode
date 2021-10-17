# frozen_string_literal: true
class Types::PaginationType < Types::BaseObject
  implements Types::PaginationInterface

  def self.entries_field(entry_type)
    field :entries, [entry_type], null: false

    define_method :entries do
      object.to_a
    end
  end
end
