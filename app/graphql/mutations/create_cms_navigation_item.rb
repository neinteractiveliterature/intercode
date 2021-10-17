# frozen_string_literal: true
class Mutations::CreateCmsNavigationItem < Mutations::BaseMutation
  field :cms_navigation_item, Types::CmsNavigationItemType, null: false

  argument :cms_navigation_item, Types::CmsNavigationItemInputType, required: true, camelize: false

  authorize_create_cms_model :cms_navigation_items

  def resolve(**args)
    cms_navigation_item_attrs =
      process_transitional_ids_in_input(args[:cms_navigation_item].to_h, :navigation_section_id, :page_id).merge(
        parent: convention
      )
    cms_navigation_item = CmsNavigationItem.create!(cms_navigation_item_attrs)
    { cms_navigation_item: cms_navigation_item }
  end
end
