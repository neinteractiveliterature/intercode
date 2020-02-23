class FormResponseChangeGroupPresenter
  SCRIPT_PATH = File.expand_path('bin/renderFormResponseChangeGroup', Rails.root)
  attr_reader :changes, :convention

  def initialize(changes, convention)
    @changes = changes
    @convention = convention

    ::ActiveRecord::Associations::Preloader.new.preload(changes, :user_con_profile)
    ::ActiveRecord::Associations::Preloader.new.preload(changes, :response)
  end

  def html
    stdout, stderr, status = Open3.capture3(shell_command)
    unless status == 0
      Rollbar.error(
        "#{SCRIPT_PATH} returned error code #{status}",
        stdout: stdout, stderr: stderr, component_props: component_props.to_json
      )
      return 'Sorry, an error occurred trying to render these changes.'
    end

    stdout.html_safe
  end

  def shell_command
    "#{SCRIPT_PATH} #{Shellwords.escape(component_props.to_json)}"
  end

  def component_props
    {
      'changeGroup' => {
        'id' => 'serverRenderedChangeGroup',
        'changes' => changes.map { |change| change_props(change) }
      },
      'convention' => {
        'id' => convention.id,
        'starts_at' => convention.starts_at,
        'ends_at' => convention.ends_at,
        'timezone_name' => convention.timezone_name
      }
    }
  end

  def change_props(change)
    {
      'id' => change.id,
      'formItem' => form_item_props(change.response, change.field_identifier),
      'user_con_profile' => {
        'id' => change.user_con_profile.id,
        'name_without_nickname' => change.user_con_profile.name_without_nickname
      },
      'field_identifier' => change.field_identifier,
      'previous_value' => change.previous_value,
      'new_value' => change.new_value,
      'created_at' => change.created_at,
      'updated_at' => change.updated_at
    }
  end

  def form_item_props(response, field_identifier)
    form = form_for_response(response)
    return nil unless form

    item = form.form_items.find { |form_item| form_item.identifier == field_identifier }
    return nil unless item

    {
      id: item.id,
      form_section_id: item.form_section_id,
      item_type: item.item_type,
      identifier: item.identifier,
      position: item.position,
      admin_description: item.admin_description,
      public_description: item.public_description,
      properties: item.properties
    }
  end

  def form_for_response(response)
    case response
    when Event then response.event_category.event_form
    when EventProposal then response.event_category.event_proposal_form
    end
  end
end
