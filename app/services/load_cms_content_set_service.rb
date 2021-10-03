# frozen_string_literal: true
class LoadCmsContentSetService < CivilService::Service
  attr_reader :convention, :content_set, :content_set_name

  validates_presence_of :convention, :content_set_name
  validate :ensure_content_set_exists
  validate :ensure_no_conflicting_user_con_profile_form

  def initialize(convention:, content_set_name:)
    @convention = convention
    @content_set_name = content_set_name
    @content_set = CmsContentSet.new(name: content_set_name)
  end

  private

  def inner_call
    [
      CmsContentLoaders::CmsLayouts,
      CmsContentLoaders::Pages,
      CmsContentLoaders::CmsPartials,
      CmsContentLoaders::NotificationTemplates
    ].each { |loader_class| loader_class.new(convention: convention, content_set: content_set).call! }

    load_form_content
    load_navigation_items
    load_files
    load_variables

    success
  end

  def load_form_content
    content_set.all_form_contents_by_name.each_value do |content|
      form =
        case content['form_type']
        when 'user_con_profile'
          convention.create_user_con_profile_form!(convention: convention, form_type: content['form_type'])
        else
          convention.forms.create!(convention: convention, form_type: content['form_type'])
        end

      ImportFormContentService.new(form: form, content: content).call!
    end

    convention.save!
  end

  def load_files
    content_set.all_file_paths.each { |path| File.open(path, 'rb') { |file| convention.cms_files.create!(file: file) } }
  end

  def load_navigation_items
    return unless content_set.metadata[:navigation_items]
    content_set.metadata[:navigation_items].each_with_index do |navigation_item, i|
      root_item = convention.cms_navigation_items.new(position: i + 1)
      populate_navigation_item(root_item, navigation_item)
      root_item.save!
    end
  end

  def load_variables
    return unless content_set.metadata[:variables]
    content_set.metadata[:variables].each { |key, value| convention.cms_variables.create!(key: key, value: value) }
  end

  def populate_navigation_item(item, data)
    item.title = data[:title]

    case data[:item_type]
    when 'section'
      data[:navigation_links].each_with_index do |link_data, i|
        link = item.navigation_links.new(position: i + 1, parent: convention)
        populate_navigation_item(link, link_data)
      end
    when 'link'
      item.page = convention.pages.find_by(slug: data[:page_slug])
    end
  end

  def ensure_content_set_exists
    return if Dir.exist?(content_set.root_path)
    errors.add(:base, "No content set found at #{content_set.root_path}")
  end

  def ensure_no_conflicting_user_con_profile_form
    return unless content_set.user_con_profile_form && convention.user_con_profile_form
    errors.add(:base, "#{convention.name} already has a user_con_profile form")
  end
end
