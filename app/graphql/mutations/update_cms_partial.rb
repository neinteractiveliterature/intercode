# frozen_string_literal: true
class Mutations::UpdateCmsPartial < Mutations::BaseMutation
  field :cms_partial, Types::CmsPartialType, null: false

  argument :id, ID, required: false
  argument :cms_partial, Types::CmsPartialInputType, required: true, camelize: false

  load_and_authorize_cms_model :cms_partials, :id, :update

  def resolve(**args)
    cms_partial.update!(args[:cms_partial].to_h)

    { cms_partial: cms_partial }
  end
end
