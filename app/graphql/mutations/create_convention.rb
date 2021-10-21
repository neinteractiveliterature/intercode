# frozen_string_literal: true
class Mutations::CreateConvention < Mutations::BaseMutation
  include ScheduledValueInputs

  field :convention, Types::ConventionType, null: false

  argument :transitional_clone_convention_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the cloneConventionId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :clone_convention_id, ID, required: false, camelize: true
  argument :transitional_organization_id,
           ID,
           deprecation_reason:
             "IDs have transitioned to the ID type.  Please switch back to the organizationId field so that \
we can remove this temporary one.",
           required: false,
           camelize: true
  argument :organization_id, ID, required: false, camelize: true
  argument :convention, Types::ConventionInputType, required: true
  argument :cms_content_set_name, String, required: false, camelize: false

  define_authorization_check { |_args| policy(Convention.new).create? }

  # rubocop:disable Metrics/MethodLength
  def resolve(
    convention:,
    clone_convention_id: nil,
    transitional_clone_convention_id: nil,
    cms_content_set_name: nil,
    organization_id: nil,
    transitional_organization_id: nil
  )
    convention_data =
      process_transitional_ids_in_input(
        convention.to_h,
        :root_page_id,
        :default_layout_id,
        :catch_all_staff_position_id
      ).merge('organization_id' => transitional_organization_id || organization_id, 'updated_by' => current_user)
    if convention.maximum_event_signups
      convention_data['maximum_event_signups'] = process_scheduled_value_input(convention.maximum_event_signups)
    end

    if transitional_clone_convention_id || clone_convention_id
      source_convention = Convention.find(transitional_clone_convention_id || clone_convention_id)
      result =
        CloneConventionService.new(source_convention: source_convention, new_convention_attributes: convention_data)
          .call!
      new_convention = result.convention
    else
      convention_data['maximum_event_signups'] ||= { timespans: [{ start: nil, finish: nil, value: 'not_yet' }] }
      new_convention = Convention.create!(convention_data)
      LoadCmsContentSetService.new(convention: new_convention, content_set_name: cms_content_set_name).call!
    end

    { convention: new_convention }
  end
  # rubocop:enable Metrics/MethodLength
end
