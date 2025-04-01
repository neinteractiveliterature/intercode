module Notifier::Conditions
  class Evaluator
    attr_reader :notifier

    def initialize(notifier:)
      @notifier = notifier
    end

    def matches?(_value)
      raise NotImplementedError
    end
  end

  class EventCategoryEvaluator < Evaluator
    attr_reader :event_category

    def initialize(notifier:, event_category:)
      super(notifier:)
      @event_category = event_category
    end

    def matches?(value)
      case value
      when Array
        value.include?(event_category.id)
      else
        value == event_category.id
      end
    end
  end
end
