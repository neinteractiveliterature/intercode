# frozen_string_literal: true
class ContentCloners::ContentClonerBase
  attr_reader :source_convention, :id_maps

  def initialize(source_convention, id_maps)
    @source_convention = source_convention
    @id_maps = id_maps.dup
  end

  def clone(_convention)
    raise NotImplementedError, "Subclasses must implement #clone"
  end

  private

  def clone_with_id_map(source_scope, destination_scope, &block)
    id_map = {}
    source_scope.find_each do |model|
      cloned_model =
        destination_scope.new(model.attributes.symbolize_keys.except(:id, :created_at, :updated_at, :image))
      block&.call(model, cloned_model)
      cloned_model.save!
      id_map[model.id] = cloned_model
    end
    id_map
  end

  def shift_scheduled_value(value, amount)
    return nil unless value

    value.class.new(
      **value.attributes.symbolize_keys,
      timespans:
        value.timespans.map do |timespan|
          {
            start: timespan.start ? timespan.start + amount : nil,
            finish: timespan.finish ? timespan.finish + amount : nil,
            value: timespan.value
          }
        end
    )
  end

  def shift_scheduled_value_by_convention_distance(convention, value)
    shift_scheduled_value(value, convention.starts_at - source_convention.starts_at)
  end
end
