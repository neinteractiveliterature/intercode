class Types::NotificationConditionTypeType < Types::BaseEnum
  description <<~MARKDOWN
    The type of a notification condition. This is used to determine what kind of condition it is and how to evaluate it.
  MARKDOWN

  Notifier::Dsl::CONDITION_EVALUATORS.each_key do |condition_type|
    value condition_type.to_s.upcase, value: condition_type
  end
end
