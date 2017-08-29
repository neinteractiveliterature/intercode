module FormResponseHelper
  def render_form_response_value(form_item, value)
    return '' if value.nil? || value.to_s.strip == ''

    case form_item.item_type
    when 'free_text'
      if form_item.properties['format'] == 'markdown'
        MarkdownPresenter.new('').render(value)
      elsif form_item.properties['lines'] > 1
        simple_format(value)
      else
        value
      end
    when 'multiple_choice'
      case value
      when Array then value.map(&:to_s).join(', ')
      else value.to_s
      end
    when 'registration_policy'
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
          end
        )
      end
    when 'timeblock_preference'
      content_tag(:ul, class: 'list-unstyled m-0') do
        safe_join(
          value.group_by(&:ordinality).sort.map do |_ordinality, preferences|
            content_tag(:li) do
              safe_join([
                content_tag(:strong, "#{preferences.first.ordinality_description}:"),
                ' ',
                preferences.sort_by(&:start).map { |preference| "#{preference.start.strftime('%a')} #{preference.label}" }.join(', ')
              ])
            end
          end
        )
      end
    when 'timespan'
      describe_timespan(value)
    end
  end

  def describe_bucket(bucket)
    if bucket.slots_limited?
      "#{bucket.minimum_slots} / #{bucket.preferred_slots} / #{bucket.total_slots}"
    else
      "unlimited"
    end
  end

  def describe_timespan(value)
    if value % 1.hour == 0
      pluralize(value / 1.hour, 'hour')
    elsif value % 1.minute == 0
      sprintf('%d:%02d', value / 1.hour, (value % 1.hour) / 1.minute)
    else
      sprintf(
        '%d:%02d:%02d',
        value / 1.hour,
        (value % 1.hour / 1.minute),
        (value % 1.minute)
      )
    end
  end
end
