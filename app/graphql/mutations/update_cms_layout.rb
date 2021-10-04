# frozen_string_literal: true
class Mutations::UpdateCmsLayout < Mutations::BaseMutation
  field :cms_layout, Types::CmsLayoutType, null: false

  argument :id,
           Integer,
           deprecation_reason:
             'IDs are transitioning to the ID type.  For the moment, please use the transitionalId field until all id fields are replaced with ones of type ID.',
           required: false
  argument :transitional_id, ID, required: false, camelize: true
  argument :cms_layout, Types::CmsLayoutInputType, required: true, camelize: false

  load_and_authorize_cms_model :cms_layouts, :id, :update

  def resolve(**args)
    cms_layout.update!(args[:cms_layout].to_h)

    { cms_layout: cms_layout }
  end
end
