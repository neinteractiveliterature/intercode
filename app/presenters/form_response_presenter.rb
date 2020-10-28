class FormResponsePresenter
  attr_reader :form, :response, :can_view_hidden_values

  def initialize(form, response, can_view_hidden_values: false)
    @form = form
    @response = response
    @can_view_hidden_values = can_view_hidden_values
  end

  def as_json
    form.form_items.each_with_object({}) do |form_item, json|
      field = form_item.identifier.to_s
      next if field.blank?

      json[field] = response.read_form_response_attribute(field)
    end
  end

  def as_json_with_rendered_markdown(group_cache_key, object_cache_key, default_content)
    raw_json = as_json
    render_promises = form.form_items.map do |form_item|
      render_form_item(group_cache_key, object_cache_key, default_content, form_item, raw_json)
    end.compact

    Promise.all(render_promises).then do |render_results|
      raw_json.merge(Hash[render_results])
    end
  end

  private

  def render_form_item(group_cache_key, object_cache_key, default_content, form_item, raw_json)
    field = form_item.identifier.to_s

    replacement_content = replacement_content_for_form_item(field, form_item, raw_json)
    return replacement_content if replacement_content

    unless form_item.item_type == 'free_text' && form_item.properties['format'] == 'markdown'
      return Promise.resolve([field, raw_json[field]])
    end

    markdown = raw_json[field]
    render_markdown_for_field(
      field,
      markdown,
      group_cache_key,
      object_cache_key,
      default_content
    ).then do |html|
      [field, html]
    end
  end

  def replacement_content_for_form_item(field, form_item, raw_json)
    return unless form_item.properties['hide_from_public'] && raw_json[field].present?
    return if can_view_hidden_values

    if form_item.item_type == 'free_text' && form_item.properties['format'] == 'markdown'
      Promise.resolve([field, '<em>This information is only available to confirmed attendees.</em>'])
    else
      Promise.resolve([field, 'This information is only available to confirmed attendees.'])
    end
  end

  def render_markdown_for_field(field, value, group_cache_key, object_cache_key, default_content)
    loader = MarkdownLoader.for(group_cache_key, default_content)
    loader.load([[object_cache_key, field], value])
  end
end
