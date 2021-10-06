# frozen_string_literal: true
class Mutations::SetConventionCanceled < Mutations::BaseMutation
  include ScheduledValueInputs

  field :convention, Types::ConventionType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :canceled, Boolean, required: true

  define_authorization_check do |args|
    @convention = args[:id] ? Convention.find(args[:id]) : context[:convention]
    policy(@convention).manage?
  end

  def resolve(**args)
    @convention.update!(canceled: args[:canceled])

    { convention: @convention }
  end
end
