require 'tempfile'
require 'open3'
require 'parallel'
require 'bcrypt'

class Intercode::Import::Intercode1::Importer
  attr_reader :connection, :con
  attr_accessor :con_domain, :con_name, :friday_date

  def initialize(constants_file, con_domain)
    @constants_file = constants_file
    @con_domain = con_domain
    @legacy_password_md5s = {}

    setup_from_constants_file(constants_file)
    @connection = Sequel.connect(@database_url)
  end

  def setup_from_constants_file(filename)
    php = <<-PHP
    <?php
      error_reporting(E_ERROR); // suppress all the warnings Intercode 1 generates
      require "#{filename}";

      $vars = array(
        "database_url" => "mysql2://".DB_ADMIN_USR.":".DB_ADMIN_PWD."@".DB_SERVER."/".DB_NAME,
        "con_name" => CON_NAME,
        "con_domain" => CON_DOMAIN,
        "friday_date" => FRI_DATE,
        "text_dir" => TEXT_DIR,
        "php_timezone" => date_default_timezone_get(),
        "show_flyer" => NAV_SHOW_FLYER,
        "show_program" => NAV_SHOW_PROGRAM,
        "thursday_enabled" => THURSDAY_ENABLED,
        "maximum_tickets" => CON_MAX
      );

      $price_schedule = array();
      $i = 0;
      while (get_con_price ($i++, $price, $start_date, $end_date)) {
        array_push($price_schedule, array("price" => $price, "start_date" => $start_date, "end_date" => $end_date));
      }

      $vars["price_schedule"] = $price_schedule;

      $possible_position_names = array(
        "ADVERTISING",
        "ATTENDEE_COORDINATOR",
        "BID_CHAIR",
        "CON_CHAIR",
        "CON_SUITE",
        "GM_COORDINATOR",
        "HOTEL_LIAISON",
        "IRON_GM",
        "OPS",
        "OPS2",
        "OUTREACH",
        "REGISTRAR",
        "SAFETY_COORDINATOR",
        "STAFF_COORDINATOR",
        "THURSDAY",
        "TREASURER",
        "VENDOR_LIAISON"
      );
      $staff_positions = array();
      foreach($possible_position_names as $position_name) {
        if (defined("NAME_" . $position_name) || defined("EMAIL_" . $position_name)) {
          $staff_positions[$position_name] = array(
            "name" => constant("NAME_" . $position_name),
            "email" => constant("EMAIL_" . $position_name)
          );
        }
      }

      $vars["staff_positions"] = $staff_positions;

      echo json_encode($vars);
    ?>
    PHP

    vars = JSON.parse(Intercode::Import::Intercode1::Php.exec_php(php, 'dump_con_vars.php'))

    text_dir = File.expand_path(vars['text_dir'], File.dirname(filename))

    @database_url = vars['database_url']
    @con_name = vars['con_name']
    @con_domain ||= vars['con_domain']
    @friday_date = Date.parse(vars['friday_date'])
    @price_schedule = vars['price_schedule']
    @staff_positions = vars['staff_positions']
    @php_timezone = ActiveSupport::TimeZone[vars['php_timezone']]
    @text_dir = text_dir
    @show_flyer = vars['show_flyer']
    @show_program = vars['show_program']
    @thursday_enabled = (vars['thursday_enabled'] == 1)
    @maximum_tickets = vars['maximum_tickets']
  end

  def build_password_hashes
    Intercode::Import::Intercode1.logger.info "Hashing legacy MD5 passwords with BCrypt"
    rows = connection[:Users].select(:UserId, :HashedPassword).to_a

    # build users in parallel because password hashing is expensive
    legacy_password_md5s = Parallel.map(rows, in_processes: Parallel.processor_count) do |row|
      Intercode::Import::Intercode1.logger.debug "Hashing password for user #{row[:UserId]}"
      [row[:UserId], BCrypt::Password.create(row[:HashedPassword])]
    end

    @connection = Sequel.connect(@database_url)

    @legacy_password_md5s = Hash[legacy_password_md5s]
  end

  def import!
    @con = con_table.build_con
    @con.save!
    Intercode::Import::Intercode1.logger.info("Imported con as ID #{@con.id}")

    @con.load_cms_content_set('standard')
    Intercode::Import::Intercode1.logger.info("Loaded standard CMS content set")

    con_table.update_cms_content(@con)
    Intercode::Import::Intercode1.logger.info("Updated CMS content with con data")

    root_html_content.import!
    text_dir_html_content.import!
    embedded_pdf_pages.each(&:import!)
    navigation_items.import!
    proposal_form.import!

    registration_status_map.each do |status, ticket_type|
      ticket_type.save!
      Intercode::Import::Intercode1.logger.info("Imported #{status} ticket type as ID #{ticket_type.id}")
    end

    events_table.import!
    users_table.import!
    staff_position_importer.import!
    away_table.import!
    bids_table.import!
    bid_times_table.import!
    bid_info_table.import!
    bios_table.import!
    rooms_table.import!
    runs_table.import!
    gms_table.import!
    signup_table.import!
  end

  def con_table
    @con_table ||= Intercode::Import::Intercode1::Tables::Con.new(
      connection,
      con_name: @con_name,
      con_domain: @con_domain,
      friday_date: @friday_date,
      constants_file: @constants_file,
      timezone_name: "US/Eastern",
      thursday_enabled: @thursday_enabled,
      maximum_tickets: @maximum_tickets
    )
  end

  def price_schedule_table
    @price_schedule_table ||= Intercode::Import::Intercode1::Tables::PriceSchedule.new(connection, @con, @price_schedule, @php_timezone)
  end

  def events_table
    @events_table ||= Intercode::Import::Intercode1::Tables::Events.new(connection, con)
  end

  def events_id_map
    @events_id_map ||= events_table.id_map
  end

  def users_table
    return unless events_id_map
    @users_table ||= Intercode::Import::Intercode1::Tables::Users.new(connection, con, events_id_map, registration_status_map, @legacy_password_md5s)
  end

  def users_id_map
    @users_id_map ||= users_table.id_map
  end

  def user_con_profiles_id_map
    @user_con_profiles_id_map ||= users_table.user_con_profile_id_map
  end

  def away_table
    return unless user_con_profiles_id_map

    @away_table ||= Intercode::Import::Intercode1::Tables::Away.new(connection, con, user_con_profiles_id_map)
  end

  def bios_table
    return unless user_con_profiles_id_map

    @bios_table ||= Intercode::Import::Intercode1::Tables::Bios.new(connection, user_con_profiles_id_map)
  end

  def bids_table
    return unless events_id_map && user_con_profiles_id_map

    @bids_table ||= Intercode::Import::Intercode1::Tables::Bids.new(connection, con, events_id_map, user_con_profiles_id_map)
  end

  def event_proposals_id_map
    @event_proposals_id_map ||= bids_table.id_map
  end

  def bid_times_table
    return unless event_proposals_id_map

    @bid_times_table ||= Intercode::Import::Intercode1::Tables::BidTimes.new(connection, con, event_proposals_id_map)
  end

  def bid_info_table
    @bid_info_table ||= Intercode::Import::Intercode1::Tables::BidInfo.new(connection, con, @constants_file)
  end

  def runs_table
    return unless events_id_map && users_id_map && rooms_id_map
    @runs_table ||= Intercode::Import::Intercode1::Tables::Runs.new(connection, con, events_id_map, users_id_map, rooms_id_map)
  end

  def run_id_map
    @run_id_map ||= runs_table.id_map
  end

  def gms_table
    return unless events_id_map && users_id_map
    @gms_table ||= Intercode::Import::Intercode1::Tables::GMs.new(connection, con, events_id_map, users_id_map, user_con_profiles_id_map)
  end

  def rooms_table
    @rooms_table ||= Intercode::Import::Intercode1::Tables::Rooms.new(connection, con)
  end

  def rooms_id_map
    @rooms_id_map ||= rooms_table.id_map
  end

  def signup_table
    @signup_table ||= Intercode::Import::Intercode1::Tables::Signup.new(connection, con, run_id_map, users_id_map, user_con_profiles_id_map)
  end

  def staff_position_importer
    @staff_position_importer ||= Intercode::Import::Intercode1::StaffPositionImporter.new(con, @staff_positions)
  end

  def root_html_content
    @root_html_content ||= Intercode::Import::Intercode1::HtmlContent.new(con, File.dirname(@constants_file), @constants_file)
  end

  def text_dir_html_content
    @text_dir_html_content ||= Intercode::Import::Intercode1::HtmlContent.new(con, @text_dir, @constants_file)
  end

  def navigation_items
    @navigation_items ||= Intercode::Import::Intercode1::NavigationItems.new(con)
  end

  def registration_status_map
    @registration_status_map ||= {
      "Paid" => price_schedule_table.build_ticket_type,
      "Comp" => con.ticket_types.new(
        name: "event_comp",
        description: "Comp ticket for event",
        pricing_schedule: ScheduledMoneyValue.always(Money.new(0, 'USD')),
        publicly_available: false
      ),
      "Marketing" => con.ticket_types.new(
        name: "marketing_comp",
        description: "Marketing comp ticket",
        pricing_schedule: ScheduledMoneyValue.always(Money.new(0, 'USD')),
        publicly_available: false
      ),
      "Vendor" => con.ticket_types.new(
        name: "vendor",
        description: "Vendor ticket",
        pricing_schedule: ScheduledMoneyValue.always(Money.new(2000, 'USD')),
        publicly_available: false,
        counts_towards_convention_maximum: false
      ),
      "Rollover" => con.ticket_types.new(
        name: "rollover",
        description: "Rollover ticket from previous year",
        pricing_schedule: ScheduledMoneyValue.always(Money.new(0, 'USD')),
        publicly_available: false
      ),
    }
  end

  def embedded_pdf_pages
    embedded_pdf_pages = []
    src_dir = File.dirname(@constants_file)

    if @show_flyer
      embedded_pdf_pages << Intercode::Import::Intercode1::EmbeddedPdfPage.new(
        con, src_dir, 'InterconFlyer.pdf', 'Flyer'
      )
    end

    if @show_program
      embedded_pdf_pages << Intercode::Import::Intercode1::EmbeddedPdfPage.new(
        con, src_dir, 'program-page-order.pdf', 'Program'
      )
    end

    embedded_pdf_pages
  end

  def proposal_form
    @proposal_form ||= Intercode::Import::Intercode1::ProposalForm.new(con)
  end
end
