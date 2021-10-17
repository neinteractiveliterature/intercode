# frozen_string_literal: true
module TransitionalIds
  def process_transitional_ids_in_input(input, *id_fields)
    id_fields.reduce(input.to_h) do |working_input, id_field|
      next working_input unless working_input.key?(:"transitional_#{id_field}")
      transitional_id_value = working_input[:"transitional_#{id_field}"]
      cast_id_value =
        transitional_id_value.is_a?(Array) ? transitional_id_value.map(&:to_i) : transitional_id_value&.to_i
      working_input.except(:"transitional_#{id_field}").merge({ id_field => cast_id_value })
    end
  end
end
