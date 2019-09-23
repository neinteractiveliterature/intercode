class LoadCmsContentSetService < CivilService::Service
  attr_reader :convention, :content_set, :content_set_name

  validates_presence_of :convention, :content_set_name
  validate :ensure_content_set_exists
  validate :ensure_no_conflicting_pages
  validate :ensure_no_conflicting_partials
  validate :ensure_no_conflicting_layouts
  validate :ensure_no_conflicting_user_con_profile_form

  def initialize(convention:, content_set_name:)
    @convention = convention
    @content_set_name = content_set_name
    @content_set = CmsContentSet.new(name: content_set_name)
  end

  private

  def inner_call
    load_content_for_subdir('layouts', 'name')
    load_content_for_subdir('pages', 'slug')
    load_content_for_subdir('partials', 'name')
    load_form_content
    load_navigation_items
    load_files
    load_variables
    set_default_layout
    set_root_page

    success
  end

  def load_form_content
    content_set.all_form_contents_by_name.values.each do |content|
      form = case content['form_type']
      when 'user_con_profile'
        convention.create_user_con_profile_form!(convention: convention, form_type: content['form_type'])
      else
        convention.forms.create!(convention: convention, form_type: content['form_type'])
      end

      ImportFormContentService.new(form: form, content: content).call!
    end

    convention.save!
  end

  def load_content_for_subdir(subdir, filename_attribute, &block)
    content_set.all_template_paths_with_names(subdir).each do |path, name|
      content, attrs = content_set.template_content(path)
      model = association_for_subdir(subdir).create!(
        filename_attribute => name,
        content: content,
        **attrs
      )

      block.call(model) if block
    end
  end

  def load_files
    content_set.all_file_paths.each do |path|
      File.open(path, 'rb') do |file|
        convention.cms_files.create!(
          file: file
        )
      end
    end
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
    content_set.metadata[:variables].each do |key, value|
      convention.cms_variables.create!(key: key, value: value)
    end
  end

  def populate_navigation_item(item, data)
    item.title = data[:title]

    if data[:item_type] == 'section'
      data[:navigation_links].each_with_index do |link_data, i|
        link = item.navigation_links.new(position: i + 1, parent: convention)
        populate_navigation_item(link, link_data)
      end
    elsif data[:item_type] == 'link'
      item.page = convention.pages.find_by(slug: data[:page_slug])
    end
  end

  def set_default_layout
    return unless content_set.metadata[:default_layout_name]
    default_layout = convention.cms_layouts.find_by(
      name: content_set.metadata[:default_layout_name]
    )
    convention.update!(default_layout: default_layout)
  end

  def set_root_page
    return unless content_set.metadata[:root_page_slug]
    convention.update!(
      root_page: convention.pages.find_by(slug: content_set.metadata[:root_page_slug])
    )
  end

  def association_for_subdir(subdir)
    case subdir
    when 'layouts' then convention.cms_layouts
    when 'pages' then convention.pages
    when 'partials' then convention.cms_partials
    else raise "Unknown content type: #{subdir}"
    end
  end

  def ensure_content_set_exists
    return if Dir.exist?(content_set.root_path)
    errors.add(:base, "No content set found at #{content_set.root_path}")
  end

  def ensure_no_conflicting_pages
    ensure_no_conflicting_content(
      'pages',
      convention.pages.pluck(:slug),
      (
        if convention.root_page
          { 'root' => 'root page' }
        else
          {}
        end
      )
    )
  end

  def ensure_no_conflicting_partials
    ensure_no_conflicting_content('partials', convention.cms_partials.pluck(:name))
  end

  def ensure_no_conflicting_layouts
    ensure_no_conflicting_content(
      'layouts',
      convention.cms_layouts.pluck(:name),
      (
        if convention.default_layout
          { 'Default' => 'default layout' }
        else
          {}
        end
      )
    )
  end

  def ensure_no_conflicting_content(subdir, content_identifiers, taken_special_identifiers = {})
    content_identifiers = Set.new(content_identifiers)

    content_set.all_template_names(subdir).each do |name|
      if taken_special_identifiers[name]
        errors.add(:base, "#{convention.name} already has a #{taken_special_identifiers[name]}")
      end

      if content_identifiers.include?(name)
        errors.add(:base, "A #{subdir.singularize} named #{name} already exists in \
#{convention.name}")
      end
    end
  end

  def ensure_no_conflicting_user_con_profile_form
    return unless content_set.user_con_profile_form && convention.user_con_profile_form
    errors.add(:base, "#{convention.name} already has a user_con_profile form")
  end
end
