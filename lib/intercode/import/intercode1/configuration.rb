class Intercode::Import::Intercode1::Configuration
  attr_reader :constants_file

  def initialize(constants_file)
    @constants_file = constants_file
    @vars = processed_vars
  end

  def var(identifier)
    @vars[identifier.to_sym]
  end

  private

  def php_dump_script_for_constants_file
    <<-PHP
    <?php
      error_reporting(E_ERROR); // suppress all the warnings Intercode 1 generates
      require "#{constants_file}";

      $vars = array(
        "database_url" => "mysql2://".DB_ADMIN_USR.":".DB_ADMIN_PWD."@".DB_SERVER."/".DB_NAME,
        "con_name" => CON_NAME,
        "friday_date" => FRI_DATE,
        "text_dir" => TEXT_DIR,
        "php_timezone" => date_default_timezone_get(),
        "show_flyer" => NAV_SHOW_FLYER,
        "show_program" => NAV_SHOW_PROGRAM,
        "thursday_enabled" => THURSDAY_ENABLED,
        "maximum_tickets" => CON_MAX,
        "shirt_name" => SHIRT_NAME,
        "shirt_2_name" => SHIRT_2_NAME,
        "shirt_two_shirts" => SHIRT_TWO_SHIRTS
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
  end

  def raw_vars
    @raw_vars ||= begin
      php = php_dump_script_for_constants_file
      JSON.parse(Intercode::Import::Intercode1::Php.exec_php(php, 'dump_con_vars.php'))
    end
  end

  def processed_vars
    raw_vars.symbolize_keys.merge(
      text_dir: File.expand_path(raw_vars['text_dir'], File.dirname(constants_file)),
      friday_date: Date.parse(raw_vars['friday_date']),
      php_timezone: ActiveSupport::TimeZone[raw_vars['php_timezone']],
      thursday_enabled: raw_vars['thursday_enabled'] == 1,
      shirt_two_shirts: raw_vars['shirt_two_shirts'] == 1
    )
  end
end
