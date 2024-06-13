class Types::RankedChoiceOrder < Types::BaseEnum
  description "An order to execute ranked-choice signup rounds in."

  value "ASC", "In lottery number order, lowest number first", value: "asc"
  value "DESC", "In lottery nmber order, highest number first", value: "desc"
end
