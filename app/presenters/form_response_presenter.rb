class FormResponsePresenter
  attr_reader :form, :response, :viewer_roles, :team_member_name

  def initialize(form, response, team_member_name: nil, viewer_roles: [])
    @form = form
    @response = response
    @viewer_roles = viewer_roles.map(&:to_s)
    @team_member_name = team_member_name
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
    return if form_item.visibility == 'normal' || raw_json[field].blank?
    return if viewer_has_role_or_higher?(form_item.visibility)

    hidden_text = I18n.t(
      "forms.hidden_text.#{form_item.visibility}",
      team_member_name_pluralized: team_member_name&.pluralize
    )

    if form_item.item_type == 'free_text' && form_item.properties['format'] == 'markdown'
      Promise.resolve([field, "<em>#{hidden_text}</em>"])
    else
      Promise.resolve([field, hidden_text])
    end
  end

  def render_markdown_for_field(field, value, group_cache_key, object_cache_key, default_content)
    loader = MarkdownLoader.for(group_cache_key, default_content)
    loader.load([[object_cache_key, field], value])
  end

  def highest_level_viewer_role
    @highest_level_viewer_role ||= FormItem::ROLE_VALUES.reverse.find do |role|
      viewer_roles.include?(role)
    end
  end

  def viewer_has_role_or_higher?(role)
    FormItem::ROLE_VALUES.index(highest_level_viewer_role) >= FormItem::ROLE_VALUES.index(role)
  end
end
