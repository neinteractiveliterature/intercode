require 'tempfile'
require 'open3'
require 'parallel'
require 'bcrypt'

class Intercode::Import::Intercode1::Importer
  attr_reader :connection, :con, :constants_file, :config
  attr_accessor :con_domain, :con_name, :friday_date

  def initialize(constants_file, con_domain)
    @constants_file = constants_file
    @con_domain = con_domain
    @legacy_password_md5s = {}

    @config = Intercode::Import::Intercode1::Configuration.new(constants_file)
    @connection = Sequel.connect(config.var(:database_url))
  end

  def build_password_hashes
    Intercode::Import::Intercode1.logger.info 'Hashing legacy MD5 passwords with BCrypt'
    rows = connection[:Users].select(:UserId, :HashedPassword).to_a

    # build users in parallel because password hashing is expensive
    legacy_password_md5s = Parallel.map(rows, in_processes: Parallel.processor_count) do |row|
      Intercode::Import::Intercode1.logger.debug "Hashing password for user #{row[:UserId]}"
      [row[:UserId], BCrypt::Password.create(row[:HashedPassword])]
    end

    @connection = Sequel.connect(config.var(:database_url))

    @legacy_password_md5s = Hash[legacy_password_md5s]
  end

  def import!
    @con = con_table.build_con
    @con.save!
    Intercode::Import::Intercode1.logger.info("Imported con as ID #{@con.id}")

    @con.load_cms_content_set('standard')
    Intercode::Import::Intercode1.logger.info('Loaded standard CMS content set')

    con_table.update_cms_content(@con)
    Intercode::Import::Intercode1.logger.info('Updated CMS content with con data')

    %i[root_html_content text_dir_html_content].each do |importer|
      send(importer).import!
    end

    embedded_pdf_pages.each(&:import!)

    %i[
      navigation_items
      proposal_form_customizer
      registration_statuses
      events_table
      users_table
      staff_position_importer
      away_table
      bids_table
      bid_times_table
      bid_info_table
      bios_table
      rooms_table
      runs_table
      gms_table
      signup_table
    ].each do |importer|
      send(importer).import!
    end

    import_store_content!
  end

  def import_store_content!
    if @connection.table_exists?('StoreItems')
      %i[
        store_items_table
        store_orders_table
        store_order_entries_table
      ].each do |importer|
        send(importer).import!
      end
    else
      legacy_t_shirt_importer.import!
    end
  end

  def con_table
    @con_table ||= Intercode::Import::Intercode1::Tables::Con.new(
      connection,
      con_name: config.var(:con_name),
      con_domain: @con_domain,
      friday_date: config.var(:friday_date),
      constants_file: constants_file,
      timezone_name: 'US/Eastern',
      thursday_enabled: config.var(:thursday_enabled),
      maximum_tickets: config.var(:maximum_tickets)
    )
  end

  def price_schedule_table
    @price_schedule_table ||= Intercode::Import::Intercode1::Tables::PriceSchedule.new(
      connection,
      @con,
      config.var(:price_schedule),
      config.var(:php_timezone)
    )
  end

  def events_table
    @events_table ||= Intercode::Import::Intercode1::Tables::Events.new(connection, con)
  end

  def events_id_map
    @events_id_map ||= events_table.id_map
  end

  def users_table
    return unless events_id_map
    @users_table ||= Intercode::Import::Intercode1::Tables::Users.new(
      connection,
      con,
      events_id_map,
      registration_statuses.registration_status_map,
      @legacy_password_md5s
    )
  end

  def users_id_map
    @users_id_map ||= users_table.id_map
  end

  def user_con_profiles_id_map
    @user_con_profiles_id_map ||= users_table.user_con_profile_id_map
  end

  def away_table
    return unless user_con_profiles_id_map

    @away_table ||= Intercode::Import::Intercode1::Tables::Away.new(
      connection,
      con,
      user_con_profiles_id_map
    )
  end

  def bios_table
    return unless user_con_profiles_id_map

    @bios_table ||= Intercode::Import::Intercode1::Tables::Bios.new(
      connection,
      user_con_profiles_id_map
    )
  end

  def bids_table
    return unless events_id_map && user_con_profiles_id_map

    @bids_table ||= Intercode::Import::Intercode1::Tables::Bids.new(
      connection,
      con,
      events_id_map,
      user_con_profiles_id_map
    )
  end

  def event_proposals_id_map
    @event_proposals_id_map ||= bids_table.id_map
  end

  def bid_times_table
    return unless event_proposals_id_map

    @bid_times_table ||= Intercode::Import::Intercode1::Tables::BidTimes.new(
      connection,
      con,
      event_proposals_id_map
    )
  end

  def bid_info_table
    @bid_info_table ||= Intercode::Import::Intercode1::Tables::BidInfo.new(
      connection,
      con,
      config.constants_file
    )
  end

  def runs_table
    return unless events_id_map && users_id_map && rooms_id_map
    @runs_table ||= Intercode::Import::Intercode1::Tables::Runs.new(
      connection,
      con,
      events_id_map,
      users_id_map,
      rooms_id_map
    )
  end

  def run_id_map
    @run_id_map ||= runs_table.id_map
  end

  def gms_table
    return unless events_id_map && users_id_map
    @gms_table ||= Intercode::Import::Intercode1::Tables::GMs.new(
      connection,
      con,
      events_id_map,
      users_id_map,
      user_con_profiles_id_map
    )
  end

  def legacy_t_shirt_importer
    @legacy_t_shirt_importer ||= Intercode::Import::Intercode1::LegacyTShirtImporter.new(
      connection,
      con,
      config,
      user_con_profiles_id_map
    )
  end

  def rooms_table
    @rooms_table ||= Intercode::Import::Intercode1::Tables::Rooms.new(connection, con, config)
  end

  def rooms_id_map
    @rooms_id_map ||= rooms_table.id_map
  end

  def signup_table
    @signup_table ||= Intercode::Import::Intercode1::Tables::Signup.new(
      connection,
      con,
      run_id_map,
      users_id_map,
      user_con_profiles_id_map
    )
  end

  def staff_position_importer
    @staff_position_importer ||= Intercode::Import::Intercode1::StaffPositionImporter.new(
      con,
      config.var(:staff_positions)
    )
  end

  def store_items_table
    @store_items_table ||= Intercode::Import::Intercode1::Tables::StoreItems.new(
      connection,
      con,
      File.expand_path('img', File.dirname(constants_file))
    )
  end

  def store_order_entries_table
    @store_order_entries_table ||= Intercode::Import::Intercode1::Tables::StoreOrderEntries.new(
      connection,
      store_orders_table.id_map,
      store_items_table.id_map
    )
  end

  def store_orders_table
    @store_orders_table ||= Intercode::Import::Intercode1::Tables::StoreOrders.new(
      connection,
      con,
      user_con_profiles_id_map
    )
  end

  def root_html_content
    @root_html_content ||= Intercode::Import::Intercode1::HtmlContent.new(
      con,
      File.dirname(constants_file),
      constants_file
    )
  end

  def text_dir_html_content
    @text_dir_html_content ||= Intercode::Import::Intercode1::HtmlContent.new(
      con,
      config.var(:text_dir),
      constants_file
    )
  end

  def navigation_items
    @navigation_items ||= Intercode::Import::Intercode1::NavigationItems.new(con)
  end

  def registration_statuses
    @registration_statuses ||= Intercode::Import::Intercode1::RegistrationStatuses.new(
      con,
      price_schedule_table.build_ticket_type
    )
  end

  def embedded_pdf_pages
    embedded_pdf_pages = []
    src_dir = File.dirname(@constants_file)

    if config.var(:show_flyer)
      embedded_pdf_pages << Intercode::Import::Intercode1::EmbeddedPdfPage.new(
        con, src_dir, 'InterconFlyer.pdf', 'Flyer'
      )
    end

    if config.var(:show_program)
      embedded_pdf_pages << Intercode::Import::Intercode1::EmbeddedPdfPage.new(
        con, src_dir, 'program-page-order.pdf', 'Program'
      )
    end

    embedded_pdf_pages
  end

  def proposal_form_customizer
    @proposal_form_customizer ||= Intercode::Import::Intercode1::ProposalFormCustomizer.new(con)
  end
end
