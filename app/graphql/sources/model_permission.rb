# frozen_string_literal: true
class Sources::ModelPermission < GraphQL::Dataloader::Source
  def initialize(model, includes = nil)
    @model = model
    @includes = includes
  end

  def fetch(keys)
    # key is a tuple of [pundit_user, action, model_id]
    keys_by_model_id = keys.group_by(&:third).transform_keys(&:to_i)

    scope = @model.where(id: keys.map(&:third).uniq)
    scope = scope.includes(@includes) if @includes.present?

    result_by_key = {}

    scope.find_each do |record|
      keys_by_model_id[record.id].each do |(pundit_user, action, model_id)|
        result_by_key[[pundit_user, action, model_id]] = Pundit.policy(pundit_user, record).public_send(:"#{action}?")
      end
    end

    keys.map { |key| result_by_key[key] }
  end
end
