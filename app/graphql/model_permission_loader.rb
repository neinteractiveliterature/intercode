class ModelPermissionLoader < GraphQL::Batch::Loader
  def initialize(model, includes = nil)
    @model = model
    @includes = includes
  end

  def perform(keys)
    # key is a tuple of [pundit_user, action, model_id]
    keys_by_model_id = keys.group_by(&:third)

    scope = @model.where(id: keys.map(&:third).uniq)
    scope = scope.includes(@includes) if @includes.present?

    scope.find_each do |record|
      keys_by_model_id[record.id].each do |(pundit_user, action, _)|
        fulfill(
          [pundit_user, action, record.id],
          Pundit.policy(pundit_user, record).public_send("#{action}?")
        )
      end
    end

    keys.each { |key| fulfill(key, false) unless fulfilled?(key) }
  end
end
