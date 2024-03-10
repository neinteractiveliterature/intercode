# frozen_string_literal: true
class Sources::ModelById < GraphQL::Dataloader::Source
  def initialize(model, column: model.primary_key, where: nil, includes: nil)
    @model = model
    @column = column.to_s
    @column_type = model.type_for_attribute(@column)
    @where = where
    @includes = includes
  end

  def fetch(keys)
    keys = keys.map { |key| @column_type.cast(key) }
    records_by_key = query(keys).index_by { |record| record.public_send(@column) }
    keys.map { |key| records_by_key[key] }
  end

  private

  def query(keys)
    scope = @model
    scope = scope.where(@where) if @where
    scope = scope.includes(@includes) if @includes
    scope.where(@column => keys)
  end
end
