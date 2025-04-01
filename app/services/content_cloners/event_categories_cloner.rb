# frozen_string_literal: true
class ContentCloners::EventCategoriesCloner < ContentCloners::ContentClonerBase
  def clone(convention)
    @id_maps[:event_categories] = clone_with_id_map(
      source_convention.event_categories,
      convention.event_categories
    ) do |event_category, cloned_event_category|
      cloned_event_category.department = @id_maps.fetch(:departments)[event_category.department_id]
      cloned_event_category.event_form = @id_maps.fetch(:forms)[event_category.event_form_id]
      cloned_event_category.event_proposal_form = (@id_maps.fetch(:forms)[event_category.event_proposal_form_id])
    end
  end
end
