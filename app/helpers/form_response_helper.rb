module FormResponseHelper
  def admin_form_item_label(form_item)
    form_item.admin_description || form_item.properties['caption'] || form_item.identifier
  end

  def render_form_response_value(form_item, value)
    return '' if value.nil? || value.to_s.strip == ''
    render_value_of_type(form_item.item_type, value, form_item.properties)
  end

  def render_value_of_type(item_type, value, properties = {})
    case item_type
    when 'free_text' then render_free_text_value(value, properties)
    when 'multiple_choice' then render_multiple_choice_value(value, properties)
    when 'registration_policy' then render_registration_policy_value(value)
    when 'timeblock_preference' then render_timeblock_preference_value(value)
    when 'timespan' then render_timespan_value(value)
    end
  end

  def describe_bucket(bucket)
    if bucket.slots_limited?
      "#{bucket.minimum_slots} / #{bucket.preferred_slots} / #{bucket.total_slots}"
    else
      'unlimited'
    end
  end

  def render_free_text_value(value, properties)
    if properties['format'] == 'markdown'
      MarkdownPresenter.new('').render(value)
    elsif properties['lines'] > 1
      MarkdownPresenter.strip_single_p(simple_format(value))
    else
      value
    end
  end

  def render_multiple_choice_value(value, properties)
    values = case value
    when Array then value.map(&:to_s)
    else [value.to_s]
    end

    values.map do |single_value|
      choice = properties['choices'].find { |c| c['value'] == single_value }
      if choice
        choice['caption']
      else
        value
      end
    end.join(', ')
  end

  def render_registration_policy_value(value)
    return render_registration_policy_value(RegistrationPolicy.new(value)) if value.is_a?(Hash)

    options_presenter = SignupOptionsPresenter.new(
      event: Event.new(registration_policy: value),
      user_con_profile: nil
    )

    content_tag(:ul, class: 'list-unstyled m-0') do
      safe_join(
        value.buckets.map do |bucket|
          content_tag(:li) do
            safe_join([
              content_tag(:strong, "#{bucket.name}:"),
              ' ',
              describe_bucket(bucket)
            ])
          end
        end + [
          content_tag(:li) do
            if options_presenter.no_preference_options.any?
              '"No preference" option will be available'
            elsif value.allow_no_preference_signups?
              '"No preference" option is inapplicable'
            else
              '"No preference" option will not be available'
            end
          end
        ]
      )
    end
  end

  def render_timeblock_preference_value(value)
    cast_value = value.map do |preference|
      if preference.is_a?(Hash)
        EventProposal::TimeblockPreference.new(preference)
      else
        preference
      end
    end

    timezone = convention.timezone

    content_tag(:ul, class: 'list-unstyled m-0') do
      safe_join(
        cast_value.group_by(&:ordinality).sort.map do |_ordinality, preferences|
          content_tag(:li) do
            safe_join([
              content_tag(:strong, "#{preferences.first.ordinality_description}:"),
              ' ',
              preferences.sort_by(&:start).map do |preference|
                start_time = preference.start.in_time_zone(timezone)
                "#{start_time.strftime('%a')} #{preference.label}"
              end.join(', ')
            ])
          end
        end
      )
    end
  end

  def render_timespan_value(value)
    if value % 1.hour == 0
      pluralize(value / 1.hour, 'hour')
    elsif value % 1.minute == 0
      format('%d:%02d', value / 1.hour, (value % 1.hour) / 1.minute)
    else
      format(
        '%d:%02d:%02d',
        value / 1.hour,
        (value % 1.hour / 1.minute),
        (value % 1.minute)
      )
    end
  end
end
