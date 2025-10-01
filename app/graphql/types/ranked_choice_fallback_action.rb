class Types::RankedChoiceFallbackAction < Types::BaseEnum
  description "An action to take if a user can't be signed up for any of their ranked choices during a signup round"

  UserConProfile.ranked_choice_fallback_actions.each_value { |enum_value| value enum_value.upcase, value: enum_value }
end
