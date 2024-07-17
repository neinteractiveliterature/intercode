# frozen_string_literal: true
class Mutations::CreateCmsPartial < Mutations::BaseMutation
  field :cms_partial, Types::CmsPartialType, null: false

  argument :cms_partial, Types::CmsPartialInputType, required: true, camelize: false

  authorize_create_cms_model :cms_partials

  def resolve(**args)
    cms_partial = cms_parent.cms_partials.create!(args[:cms_partial].to_h)

    { cms_partial: cms_partial }
  end
end
