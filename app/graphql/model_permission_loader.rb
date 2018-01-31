class ModelPermissionLoader < GraphQL::Batch::Loader
  def initialize(model)
    @model = model
  end

  def perform(keys)
    # key is a tuple of [ability, action, model_id]
    keys_by_model_id = keys.group_by(&:third)

    @model.where(id: keys.map(&:third).uniq).find_each do |record|
      keys_by_model_id[record.id].each do |(ability, action, _)|
        fulfill([ability, action, record.id], ability.can?(action, record))
      end
    end

    keys.each { |key| fulfill(key, false) unless fulfilled?(key) }
  end
end
