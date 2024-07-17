# frozen_string_literal: true
module ScheduledValueInputs
  def process_scheduled_value_input(input_data)
    return nil unless input_data && input_data[:timespans]

    timespans_data =
      input_data[:timespans].map do |timespan|
        value = (timespan[:string_value])

        { start: timespan[:start], finish: timespan[:finish], value: }
      end

    { timespans: timespans_data }
  end
end
