class Types::BaseObject < GraphQL::Schema::Object
  def can?(*args)
    context[:current_ability].can?(*args)
  end
end
