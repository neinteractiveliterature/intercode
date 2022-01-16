# frozen_string_literal: true
class CmsContentSet
  def self.root_path
    File.expand_path('cms_content_sets', Rails.root)
  end

  attr_reader :name

  def initialize(name:)
    @name = name
  end

  def user_con_profile_form
    @user_con_profile_form ||=
      begin
        persister = CmsContentPersisters::Forms.new(nil, self)
        items_with_attrs = persister.all_items.map { |item| [item, persister.read_item_attrs(item)] }
        user_con_profile_forms = items_with_attrs.select { |(_item, attrs)| attrs['form_type'] == 'user_con_profile' }
        raise 'Content set contains multiple user_con_profile forms' if user_con_profile_forms.size > 1
        user_con_profile_forms.first&.first
      end
  end

  def metadata
    @metadata ||=
      begin
        metadata_path = content_path('metadata.yml')
        File.exist?(metadata_path) ? YAML.safe_load(File.read(metadata_path)).deep_symbolize_keys : {}
      end
  end

  def inherit_content_sets
    return [] unless metadata[:inherit]

    @inherit_content_sets ||=
      metadata[:inherit].flat_map do |content_set_name|
        content_set = CmsContentSet.new(name: content_set_name)
        [content_set, *content_set.inherit_content_sets]
      end
  end

  def content_path(*parts)
    File.expand_path(File.join(parts), root_path)
  end

  def root_path
    File.expand_path(name, CmsContentSet.root_path)
  end
end
