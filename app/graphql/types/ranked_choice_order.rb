class Types::RankedChoiceOrder < Types::BaseEnum
  description "An order to execute ranked-choice signup rounds in."

  value "ASC", "In lottery number order, lowest number first", value: "asc"
  value "DESC", "In lottery number order, highest number first", value: "desc"
  value "ASC_SERPENTINE",
        "In lottery number order, lowest number first, then highest, then lowest, etc.",
        value: "asc_serpentine"
  value "DESC_SERPENTINE",
        "In lottery number order, highest number first, then lowest, then highest, etc.",
        value: "desc_serpentine"
end
