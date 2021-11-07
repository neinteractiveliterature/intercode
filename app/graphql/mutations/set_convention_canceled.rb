# frozen_string_literal: true
class Mutations::SetConventionCanceled < Mutations::BaseMutation
  include ScheduledValueInputs

  field :convention, Types::ConventionType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false
  argument :canceled, Boolean, required: true

  define_authorization_check do |args|
    @convention =
      args[:transitional_id] || args[:id] ? Convention.find(args[:transitional_id] || args[:id]) : context[:convention]
    policy(@convention).manage?
  end

  def resolve(**args)
    @convention.update!(canceled: args[:canceled])

    { convention: @convention }
  end
end
