# frozen_string_literal: true
class Mutations::DeleteCmsNavigationItem < Mutations::BaseMutation
  field :cms_navigation_item, Types::CmsNavigationItemType, null: false

  argument :transitional_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the id field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :id, ID, required: false

  load_and_authorize_cms_model :cms_navigation_items, :id, :destroy

  def resolve(**_args)
    cms_navigation_item.destroy!
    { cms_navigation_item: cms_navigation_item }
  end
end
