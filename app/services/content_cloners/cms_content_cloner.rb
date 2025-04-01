# frozen_string_literal: true
class ContentCloners::CmsContentCloner < ContentCloners::ContentClonerBase
  def clone(convention)
    clone_simple_cms_content(convention)
    clone_pages(convention)
    clone_cms_navigation_items(convention)
    clone_cms_files(convention)
    clone_cms_content_group_contents(convention)
    clone_notification_templates(convention)

    convention.update!(
      root_page: @id_maps[:pages][source_convention.root_page_id],
      default_layout: @id_maps[:cms_layouts][source_convention.default_layout_id],
      user_con_profile_form: @id_maps[:forms][source_convention.user_con_profile_form_id]
    )
  end

  private

  def clone_simple_cms_content(convention)
    %i[cms_graphql_queries cms_variables cms_layouts cms_partials].each do |association|
      Rails.logger.info("Cloning #{association}")
      @id_maps[association] = clone_with_id_map(
        source_convention.public_send(association),
        convention.public_send(association)
      )
    end
  end

  def clone_pages(convention)
    Rails.logger.info("Cloning pages")
    @id_maps[:pages] = clone_with_id_map(source_convention.pages, convention.pages) do |page, cloned_page|
      cloned_page.cms_layout = @id_maps[:cms_layouts][page.cms_layout_id]
    end
  end

  def clone_cms_navigation_items(convention)
    Rails.logger.info("Cloning navigation items")
    clone_with_id_map(
      source_convention.cms_navigation_items.root.order(:position),
      convention.cms_navigation_items
    ) do |navigation_item, cloned_navigation_item|
      cloned_navigation_item.page = @id_maps[:pages][navigation_item.page_id]
      cloned_navigation_item.save!
      clone_with_id_map(
        navigation_item.navigation_links.order(:position),
        convention.cms_navigation_items
      ) do |navigation_link, cloned_navigation_link|
        cloned_navigation_link.navigation_section = cloned_navigation_item
        cloned_navigation_link.page = @id_maps[:pages][navigation_link.page_id]
      end
    end
  end

  def clone_cms_files(convention)
    Rails.logger.info("Cloning files")

    @id_maps[:cms_files] = clone_with_id_map(source_convention.cms_files, convention.cms_files) do |file, cloned_file|
      cloned_file.file.attach(file.file.blob)
    end
  end

  def clone_cms_content_group_contents(convention)
    Rails.logger.info("Cloning CMS content group contents")

    convention.cms_content_groups.find_each do |cms_content_group|
      cloned_cms_content_group = @id_maps.fetch(:cms_content_groups).fetch(cms_content_group.id)

      %i[pages cms_partials cms_layouts].each do |content_type|
        cms_content_group
          .public_send(content_type)
          .each do |item|
            cloned_cms_content_group.cms_content_group_associations.create!(content: @id_maps[content_type][item.id])
          end
      end
    end
  end

  def clone_notification_templates(convention)
    Rails.logger.info("Cloning notification templates")

    @id_maps[:notification_templates] = clone_with_id_map(
      source_convention.notification_templates,
      convention.notification_templates
    ) do |notification_template, cloned_notification_template|
      cloned_notification_template.save!

      cloned_notification_template.notification_destinations.destroy_all
      destination_id_map = clone_notification_destinations(notification_template, cloned_notification_template)
      @id_maps[:notification_destinations].merge!(destination_id_map)
    end
  end
end
