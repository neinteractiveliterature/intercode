class CloneConventionService < CivilService::Service
  class Result < CivilService::Result
    attr_accessor :convention
  end
  self.result_class = Result

  attr_reader :source_convention, :new_convention_attributes

  def initialize(source_convention:, new_convention_attributes:)
    @source_convention = source_convention
    @new_convention_attributes = {
      show_schedule: 'no',
      accepting_proposals: false
    }.merge(source_convention.attributes.symbolize_keys.slice(*%i[
      maximum_tickets
      ticket_name
      ticket_mode
      timezone_name
      stripe_publishable_key
      stripe_secret_key
      clickwrap_agreement
    ])).merge(new_convention_attributes.symbolize_keys)
  end

  private

  def inner_call
    convention = Convention.new(new_convention_attributes)
    convention.organization ||= source_convention.organization

    ActiveRecord::Base.transaction do
      unless new_convention_attributes.key?(:maximum_event_signups)
        convention.maximum_event_signups = shift_scheduled_value_by_convention_distance(
          convention,
          source_convention.maximum_event_signups
        )
      end
      convention.save!

      @id_maps = {
        conventions: { source_convention.id => convention }
      }
      clone_cms_content(convention)
      clone_event_categories(convention)
      clone_rooms(convention)
      clone_ticket_types(convention)
      clone_staff_positions(convention)
      clone_store_content(convention)
      clone_user_activity_alerts(convention)
    end

    success(convention: convention)
  end

  def clone_cms_content(convention)
    clone_simple_cms_content(convention)
    clone_pages(convention)
    clone_cms_navigation_items(convention)
    clone_cms_files(convention)
    clone_forms(convention)
    clone_cms_content_groups(convention)

    convention.update!(
      root_page: @id_maps[:pages][source_convention.root_page_id],
      default_layout: @id_maps[:cms_layouts][source_convention.default_layout_id],
      user_con_profile_form: @id_maps[:forms][source_convention.user_con_profile_form_id]
    )
  end

  def clone_cms_files(convention)
    Rails.logger.info('Cloning files')
    @id_maps[:cms_files] = clone_with_id_map(
      source_convention.cms_files,
      convention.cms_files
    ) do |file, cloned_file|
      file.file.cache_stored_file!
      cloned_file.file = file.file
    end
  end

  def clone_cms_navigation_items(convention)
    Rails.logger.info('Cloning navigation items')
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

  def clone_forms(convention)
    @id_maps[:forms] = clone_with_id_map(
      source_convention.forms,
      convention.forms
    ) do |form, cloned_form|
      cloned_form.save!
      content = FormExportPresenter.new(form).as_json
      ImportFormContentService.new(form: cloned_form, content: content).call!
    end
  end

  def clone_cms_content_groups(convention)
    @id_maps[:cms_content_groups] = clone_with_id_map(
      source_convention.cms_content_groups,
      convention.cms_content_groups
    ) do |cms_content_group, cloned_cms_content_group|
      cloned_cms_content_group.save!
      %i[pages cms_partials cms_layouts].each do |content_type|
        cms_content_group.public_send(content_type).each do |item|
          cloned_cms_content_group.cms_content_group_associations.create!(
            content: @id_maps[content_type][item.id]
          )
        end
      end
    end
  end

  def clone_event_categories(convention)
    @id_maps[:event_categories] = clone_with_id_map(
      source_convention.event_categories,
      convention.event_categories
    ) do |event_category, cloned_event_category|
      cloned_event_category.event_form = @id_maps[:forms][event_category.event_form_id]
      cloned_event_category.event_proposal_form = @id_maps[:forms][event_category.event_proposal_form_id]
    end
  end

  def clone_pages(convention)
    Rails.logger.info('Cloning pages')
    @id_maps[:pages] = clone_with_id_map(
      source_convention.pages,
      convention.pages
    ) do |page, cloned_page|
      cloned_page.cms_layout = @id_maps[:cms_layouts][page.cms_layout_id]
    end
  end

  def clone_rooms(convention)
    @id_maps[:rooms] = clone_with_id_map(source_convention.rooms, convention.rooms)
  end

  def clone_simple_cms_content(convention)
    %i[
      cms_graphql_queries cms_variables cms_layouts cms_partials notification_templates
    ].each do |association|
      Rails.logger.info("Cloning #{association}")
      @id_maps[association] = clone_with_id_map(
        source_convention.public_send(association),
        convention.public_send(association)
      )
    end
  end

  def clone_ticket_types(convention)
    @id_maps[:ticket_types] = clone_with_id_map(
      source_convention.ticket_types,
      convention.ticket_types
    ) do |ticket_type, cloned_ticket_type|
      cloned_ticket_type.pricing_schedule = shift_scheduled_value_by_convention_distance(
        convention,
        ticket_type.pricing_schedule
      )
    end
  end

  def clone_staff_positions(convention)
    @id_maps[:staff_positions] = clone_with_id_map(
      source_convention.staff_positions,
      convention.staff_positions
    ) do |staff_position, cloned_staff_position|
      cloned_staff_position.email = replace_convention_domain(
        staff_position.email,
        convention
      )
      cloned_staff_position.save!

      staff_position.permissions.each do |permission|
        cloned_staff_position.permissions.create!(
          model: @id_maps[permission.model.class.table_name.to_sym][permission.model.id],
          permission: permission.permission
        )
      end
    end
  end

  def clone_store_content(convention)
    @id_maps[:product_variants] = {}
    @id_maps[:products] = clone_with_id_map(
      source_convention.products,
      convention.products
    ) do |product, cloned_product|
      cloned_product.save!
      variant_id_map = clone_with_id_map(product.product_variants, cloned_product.product_variants)
      @id_maps[:product_variants].merge!(variant_id_map)
    end
  end

  def clone_user_activity_alerts(convention)
    @id_maps[:notification_destinations] = {}
    @id_maps[:user_activity_alerts] = clone_with_id_map(
      source_convention.user_activity_alerts,
      convention.user_activity_alerts
    ) do |user_activity_alert, cloned_user_activity_alert|
      cloned_user_activity_alert.save!

      destination_id_map = clone_with_id_map(
        user_activity_alert.notification_destinations.where.not(staff_position_id: nil),
        cloned_user_activity_alert.notification_destinations
      ) do |notification_destination, cloned_notification_destination|
        cloned_notification_destination.staff_position = @id_maps[:staff_positions][notification_destination.staff_position_id]
        cloned_notification_destination.user_con_profile = nil
      end
      @id_maps[:notification_destinations].merge!(destination_id_map)
    end
  end

  def clone_with_id_map(source_scope, destination_scope, &block)
    id_map = {}
    source_scope.find_each do |model|
      cloned_model = destination_scope.new(
        model.attributes.symbolize_keys.except(:id, :created_at, :updated_at)
      )
      block.call(model, cloned_model) if block
      cloned_model.save!
      id_map[model.id] = cloned_model
    end
    id_map
  end

  def shift_scheduled_value(value, amount)
    return nil unless value

    value.class.new(
      **value.attributes.symbolize_keys.merge(
        timespans: value.timespans.map do |timespan|
          {
            start: timespan.start ? timespan.start + amount : nil,
            finish: timespan.finish ? timespan.finish + amount : nil,
            value: timespan.value
          }
        end
      )
    )
  end

  def shift_scheduled_value_by_convention_distance(convention, value)
    shift_scheduled_value(value, convention.starts_at - source_convention.starts_at)
  end

  def replace_convention_domain(string, convention)
    return nil unless string
    string.gsub(/#{Regexp.escape source_convention.domain}/, convention.domain)
  end
end
