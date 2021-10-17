# frozen_string_literal: true
class Mutations::UpdateCmsPartial < Mutations::BaseMutation
  field :cms_partial, Types::CmsPartialType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             "IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until \
all id fields are replaced with ones of type ID.",
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :cms_partial, Types::CmsPartialInputType, required: true, camelize: false

  load_and_authorize_cms_model :cms_partials, :id, :update

  def resolve(**args)
    cms_partial.update!(args[:cms_partial].to_h)

    { cms_partial: cms_partial }
  end
end
