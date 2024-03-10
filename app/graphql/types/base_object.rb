# frozen_string_literal: true
class Types::BaseObject < GraphQL::Schema::Object
  include ContextAccessors

  def self.association_loader(model_class, association)
    define_method association do
      return object.public_send(association) if object.association(association).loaded?
      dataloader.with(Sources::ActiveRecordAssociation, model_class, association).load(object)
    end
  end

  def self.association_loaders(model_class, *associations)
    associations.each { |association| association_loader model_class, association }
  end

  def self.pagination_field(name, pagination_type, filters_input_type, **options, &block)
    field name, pagination_type, null: false, **options do
      argument :page, Int, required: false do
        description "The page number to return from the result set.  Page numbers start with 1."
      end
      argument :per_page, Int, required: false, camelize: false do
        description "The number of items to return per page.  Defaults to 20, can go up to 200."
      end
      argument :filters, filters_input_type, required: false do
        description "Filters to restrict what items will appear in the result set."
      end
      argument :sort, [Types::SortInputType], required: false do
        description <<~MARKDOWN
          A set of fields to use for ordering the result set. The second field is used as a
          tiebreaker for the first, the third field is used as a tiebreaker for the first two,
          and so on. If the sort argument is missing or empty, the order of items will be left
          up to the database (and may be unpredictable).
        MARKDOWN
      end

      instance_eval(&block) if block
    end
  end

  def self.authorize_record
    define_singleton_method :authorized? do |record, context|
      Pundit.policy(context[:pundit_user], record).read?
    end
  end

  field_class Types::UncamelizedField
end
