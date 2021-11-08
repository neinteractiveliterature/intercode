# frozen_string_literal: true
class Mutations::DeleteCmsPartial < Mutations::BaseMutation
  field :cms_partial, Types::CmsPartialType, null: false

  argument :id, ID, required: false

  load_and_authorize_cms_model :cms_partials, :id, :destroy

  def resolve(**_args)
    cms_partial.destroy!
    { cms_partial: cms_partial }
  end
end
