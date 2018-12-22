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

  def can?(*args)
    context[:current_ability].can?(*args)
  end
end
