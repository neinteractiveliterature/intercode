# frozen_string_literal: true
class Mutations::CreateCmsPartial < Mutations::BaseMutation
  field :cms_partial, Types::CmsPartialType, null: false

  argument :partial_block_name, Types::CmsPartialBlockName, required: false, camelize: false
  argument :cms_partial, Types::CmsPartialInputType, required: true, camelize: false

  authorize_create_cms_model :cms_partials

  def resolve(partial_block_name: nil, **args)
    attributes = args[:cms_partial].to_h.with_indifferent_access
    attributes[:name] = partial_block_name if partial_block_name

    cms_partial = cms_parent.cms_partials.create!(attributes)

    { cms_partial: }
  end
end
