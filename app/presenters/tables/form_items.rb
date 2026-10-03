# frozen_string_literal: true

# Table support for convention-specific form items (custom form fields).
#
# A presenter that wants to expose form items registers a field with this class as its base and overrides the hooks
# below as needed:
#
#   field :form_items, "Convention-specific form items", Tables::FormItems::FormItemsField do
#     def form_items_for(event_proposal) ... end
#   end
#
# The field is path-based: it provides filtering (using the "form_items" filter) as well as CSV columns addressed as
# "form_items.<identifier>" in the presenter's visible_field_ids.
module Tables::FormItems
  class FormItemsField < Tables::TableResultsPresenter::Field
    def path_based?
      true
    end

    ### Hooks

    # The model that holds the form response for a given table row (e.g. a Run's Event)
    def form_response_for(row)
      row
    end

    # The form items that apply to a given table row (used to look up item types for formatting and authorization)
    def form_items_for(row)
      raise NotImplementedError, "#{self.class.name} must implement form_items_for"
    end

    # All form items that could appear in this table, across rows (used for column headers)
    def candidate_form_items
      raise NotImplementedError, "#{self.class.name} must implement candidate_form_items"
    end

    # Whether the form item is allowed to be exposed in this table at all, regardless of viewer role
    def exposed_form_item?(_form_item)
      true
    end

    # The name of the table holding the additional_info column that custom form items are stored in
    def additional_info_table_name
      presenter.base_scope.model.table_name
    end

    def header_description_for(form_item)
      form_item.public_description
    end

    ### Implementation

    def apply_filter(scope, value)
      quoted_table_name = scope.connection.quote_table_name(additional_info_table_name)

      value
        .each
        .inject(scope) do |acc_scope, (identifier, values)|
          if values.present?
            acc_scope.where(
              %(#{quoted_table_name}."additional_info"->:field ?| array[:values]),
              field: identifier,
              values: Array(values)
            )
          else
            acc_scope
          end
        end
    end

    def csv_header_for_path(path)
      identifier = path.first
      form_item = candidate_form_items.find { |item| item.identifier == identifier }
      return identifier.to_s.humanize unless form_item

      header_description_for(form_item).presence || identifier.to_s.humanize
    end

    def generate_csv_cell(row, path = nil)
      identifier = path&.first
      return nil if identifier.blank?

      form_item = exposed_form_item_for(row, identifier)
      return nil unless form_item

      form_response = form_response_for(row)
      viewer_role = viewer_role_for(form_response)
      value = form_response_value(form_response, form_item, viewer_role)
      form_item.visible_to?(viewer_role) ? form_item_value_to_csv(form_item, value) : value
    end

    private

    def exposed_form_item_for(row, identifier)
      form_item = form_items_for(row)&.find { |item| item.identifier == identifier }
      form_item if form_item && exposed_form_item?(form_item)
    end

    # Rows are exported one at a time, so only the most recent row's role needs to be remembered
    def viewer_role_for(form_response)
      return @viewer_role if @viewer_role_response.equal?(form_response)

      @viewer_role_response = form_response
      @viewer_role = Pundit.policy(presenter.pundit_user, form_response).form_item_viewer_role.to_s
    end

    # Goes through FormResponsePresenter so that hidden values are replaced with the same placeholder text as in the UI
    def form_response_value(form_response, form_item, viewer_role)
      FormResponsePresenter.new(
        nil,
        form_response,
        preloaded_form_items: [form_item],
        viewer_role: viewer_role,
        team_member_name: form_response.try(:event_category)&.team_member_name
      ).as_json(only_items: [form_item.identifier])[
        form_item.identifier
      ]
    end

    def form_item_value_to_csv(form_item, value)
      return nil if value.nil?

      case form_item.item_type
      when "timeblock_preference"
        timeblock_preference_to_csv_cell(value)
      when "multiple_choice"
        multiple_choice_to_csv_cell(form_item, value)
      else
        value
      end
    end

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
