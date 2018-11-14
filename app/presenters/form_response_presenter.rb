class FormResponsePresenter
  attr_reader :form, :response

  def initialize(form, response)
    @form = form
    @response = response
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
      next unless form_item.item_type == 'free_text' && form_item.properties['format'] == 'markdown'

      field = form_item.identifier.to_s
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
    end.compact

    Promise.all(render_promises).then do |render_results|
      raw_json.merge(Hash[render_results])
    end
  end

  private

  def render_markdown_for_field(field, value, group_cache_key, object_cache_key, default_content)
    loader = MarkdownLoader.for(group_cache_key, default_content)
    loader.load([[object_cache_key, field], value])
  end
end
