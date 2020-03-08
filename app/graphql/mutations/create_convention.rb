class Mutations::CreateConvention < Mutations::BaseMutation
  include ScheduledValueInputs

  field :convention, Types::ConventionType, null: false

  argument :clone_convention_id, Integer, required: false, camelize: false
  argument :organization_id, Integer, required: false, camelize: false
  argument :convention, Types::ConventionInputType, required: true
  argument :cms_content_set_name, String, required: false, camelize: false

  define_authorization_check do |_args|
    policy(Convention.new).create?
  end

  def resolve(convention:, clone_convention_id: nil, cms_content_set_name: nil, organization_id: nil)
    convention_data = convention.to_h.merge(
      'organization_id' => organization_id,
      'updated_by' => current_user
    )
    if convention.maximum_event_signups
      convention_data['maximum_event_signups'] = process_scheduled_value_input(
        convention.maximum_event_signups
      )
    end

    if clone_convention_id
      source_convention = Convention.find(clone_convention_id)
      result = CloneConventionService.new(
        source_convention: source_convention,
        new_convention_attributes: convention_data
      ).call!
      new_convention = result.convention
    else
      convention_data['maximum_event_signups'] ||= {
        timespans: [{ start: nil, finish: nil, value: 'not_yet' }]
      }
      new_convention = Convention.create!(convention_data)
      LoadCmsContentSetService.new(
        convention: new_convention,
        content_set_name: cms_content_set_name
      ).call!
    end

    { convention: new_convention }
  end
end
