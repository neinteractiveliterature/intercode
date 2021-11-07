# frozen_string_literal: true
class Mutations::DeleteCmsLayout < Mutations::BaseMutation
  field :cms_layout, Types::CmsLayoutType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_cms_model :cms_layouts, :id, :destroy

  def resolve(**_args)
    cms_layout.destroy!
    { cms_layout: cms_layout }
  end
end
