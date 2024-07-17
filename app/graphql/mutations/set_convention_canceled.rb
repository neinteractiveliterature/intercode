# frozen_string_literal: true
class Mutations::SetConventionCanceled < Mutations::BaseMutation
  include ScheduledValueInputs

  field :convention, Types::ConventionType, null: false

  argument :canceled, Boolean, required: true
  argument :id, ID, required: false

  define_authorization_check do |args|
    @convention = args[:id] ? Convention.find(args[:id]) : context[:convention]
    policy(@convention).manage?
  end

  def resolve(**args)
    @convention.update!(canceled: args[:canceled])

    { convention: @convention }
  end
end
