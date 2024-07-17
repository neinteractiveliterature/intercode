# frozen_string_literal: true
class Mutations::DeleteCmsNavigationItem < Mutations::BaseMutation
  field :cms_navigation_item, Types::CmsNavigationItemType, null: false

  argument :id, ID, required: false

  load_and_authorize_cms_model :cms_navigation_items, :id, :destroy

  def resolve(**_args)
    cms_navigation_item.destroy!
    { cms_navigation_item: }
  end
end
