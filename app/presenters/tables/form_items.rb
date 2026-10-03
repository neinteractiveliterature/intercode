# frozen_string_literal: true
#
module Tables::FormItems
  class FormItemsField < Tables::TableResultsPresenter::Field
    def path_based?
      true
    end

    def apply_filter(scope, value)
      value
        .each
        .inject(scope) do |acc_scope, (identifier, values)|
          if values.present?
            acc_scope.where(
              %("event_proposals"."additional_info"->:field ?| array[:values]),
              field: identifier,
              values: Array(values)
            )
          else
            acc_scope
          end
        end
    end

    def form_item_value_to_csv(form_item, value)
      return nil unless form_item && value

      case form_item.item_type
      when "timeblock_preference"
        timeblock_preference_to_csv_cell(value)
      when "multiple_choice"
        multiple_choice_to_csv_cell(form_item, value)
      else
        value
      end
    end

    def generate_csv_cell(object, path)
      identifier = path.first
      form_item = object.event_category.event_proposal_form&.form_items&.find { |item| item.identifier == identifier }
      value = object.read_form_response_attribute(identifier)
      form_item_value_to_csv(form_item, value)
    end

    private

    def multiple_choice_to_csv_cell(form_item, value)
      values = Array(value)
      choices = form_item.properties.fetch("choices", [])
      values
        .map do |choice_value|
          choice = choices.find { |c| c["value"] == choice_value }
          choice ? choice["caption"] : choice_value
        end
        .join(", ")
    end

    def timeblock_preference_to_csv_cell(value)
      preferences_by_ordinality = value.group_by(&:ordinality)
      preferences_by_ordinality
        .keys
        .sort
        .map do |ordinality|
          preferences = preferences_by_ordinality[ordinality].sort_by(&:start)
          "#{preferences.first.ordinality_description}: #{
            preferences.map { |preference| "#{preference.start.strftime("%A")} #{preference.label}" }.join(", ")
          }"
        end
        .join("\n")
    end
  end
end
