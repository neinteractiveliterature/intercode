# frozen_string_literal: true
class Mutations::SortCmsNavigationItems < Mutations::BaseMutation
  argument :sort_items, [Mutations::UpdateCmsNavigationItem.input_type], required: true, camelize: false

  def authorized?(sort_items:)
    @navigation_items = CmsNavigationItem.find(sort_items.pluck(:id))
    @navigation_items.each { |navigation_item| self.class.check_authorization(policy(navigation_item), :update) }
  end

  def resolve(sort_items:)
    sort_items.each do |sort_item|
      cms_navigation_item_attrs =
        sort_item[:cms_navigation_item].to_h.symbolize_keys.slice(:position, :navigation_section_id)
      navigation_item = @navigation_items.find { |item| item[:id] == sort_item[:id] }
      navigation_item.update!(cms_navigation_item_attrs)
    end

    {}
  end
end
