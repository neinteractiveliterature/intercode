class Types::BaseObject < GraphQL::Schema::Object
  def self.association_loader(model_class, association)
    define_method association do
      AssociationLoader.for(model_class, association).load(object)
    end
  end

  def self.association_loaders(model_class, *associations)
    associations.each do |association|
      association_loader model_class, association
    end
  end

  def self.pagination_field(name, pagination_type, filters_input_type, **options, &block)
    field name, pagination_type, null: false, **options do
      argument :page, Int, required: false
      argument :per_page, Int, required: false, camelize: false
      argument :filters, filters_input_type, required: false
      argument :sort, [Types::SortInputType], required: false

      instance_eval(&block) if block
    end
  end

  field_class Types::BaseField

  # Convenience accessors for stuff the context will have
  %i[
    current_user
    current_ability
    user_con_profile
    convention
    cadmus_renderer
    current_pending_order
    assumed_identity_from_profile
    verified_request
  ].each do |context_attribute|
    define_method context_attribute do
      context[context_attribute]
    end
  end

  delegate :can?, to: :current_ability
end
