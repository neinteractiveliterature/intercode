class Intercode::Import::Intercode1::Importer
  attr_reader :connection, :con
  attr_accessor :con_domain, :con_name, :friday_date

  def self.from_constants_file(filename)
    php = <<-PHP
    require "#{filename}";

    $vars = array(
      "database_url" => "mysql2://".DB_ADMIN_USR.":".DB_ADMIN_PWD."@".DB_SERVER."/".DB_NAME,
      "con_name" => CON_NAME,
      "con_domain" => CON_DOMAIN,
      "friday_date" => FRI_DATE,
      "php_timezone" => date_default_timezone_get()
    );

    $price_schedule = array();
    $i = 0;
    while (get_con_price ($i++, $price, $start_date, $end_date)) {
      array_push($price_schedule, array("price" => $price, "start_date" => $start_date, "end_date" => $end_date));
    }

    $vars["price_schedule"] = $price_schedule;

    echo json_encode($vars);
    PHP

    vars = JSON.parse `php -r '#{php}'`

    new(
      Sequel.connect(vars['database_url']),
      vars['con_name'],
      vars['con_domain'],
      Date.parse(vars['friday_date']),
      vars['price_schedule'],
      vars['php_timezone']
    )
  end

  def initialize(connection, con_name, con_domain, friday_date, price_schedule, php_timezone)
    @connection = connection
    @con_name = con_name
    @con_domain = con_domain
    @friday_date = friday_date
    @price_schedule = price_schedule
    @php_timezone = ActiveSupport::TimeZone[php_timezone]
  end

  def import!
    @con = con_table.build_con
    @con.save!
    Intercode::Import::Intercode1.logger.info("Imported con as ID #{@con.id}")

    registration_status_map.each do |status, ticket_type|
      ticket_type.save!
      Intercode::Import::Intercode1.logger.info("Imported #{status} ticket type as ID #{ticket_type.id}")
    end

    events_table.import!
    users_table.import!
    rooms_table.import!
    runs_table.import!
    gms_table.import!
    signup_table.import!
  end

  def con_table
    @con_table ||= Intercode::Import::Intercode1::Tables::Con.new(connection, @con_name, @con_domain, @friday_date)
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
    @users_table ||= Intercode::Import::Intercode1::Tables::Users.new(connection, con, events_id_map, registration_status_map)
  end

  def users_id_map
    @users_id_map ||= users_table.id_map
  end

  def user_con_profiles_id_map
    @user_con_profiles_id_map ||= users_table.user_con_profile_id_map
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

  def registration_status_map
    @registration_status_map ||= {
      "Paid" => price_schedule_table.build_ticket_type,
      "Comp" => con.ticket_types.new(
        name: "event_comp",
        description: "Comp ticket for event",
        pricing_schedule: ScheduledMoneyValue.always(Money.new(0, 'USD'))
      ),
      "Marketing" => con.ticket_types.new(
        name: "marketing_comp",
        description: "Marketing comp ticket",
        pricing_schedule: ScheduledMoneyValue.always(Money.new(0, 'USD'))
      ),
      "Vendor" => con.ticket_types.new(
        name: "vendor",
        description: "Vendor ticket",
        pricing_schedule: ScheduledMoneyValue.always(Money.new(2000, 'USD'))
      ),
      "Rollover" => con.ticket_types.new(
        name: "rollover",
        description: "Rollover ticket from previous year",
        pricing_schedule: ScheduledMoneyValue.always(Money.new(0, 'USD'))
      ),
    }
  end
end