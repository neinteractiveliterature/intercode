class Types::Alert < Types::BaseUnion
  possible_types Types::UserActivityAlert

  def self.resolve_type(object, _context)
    case object
    when UserActivityAlert then Types::UserActivityAlert
    end
  end
end
