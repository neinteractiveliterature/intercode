class Intercode::Import::Intercode1::StaffPositionImporter
  STAFF_POSITION_NAMES_BY_KEY = {
    "ADVERTISING" => "Advertising",
    "ATTENDEE_COORDINATOR" => "Attendee Coordinator",
    "BID_CHAIR" => "Game Proposals Chair",
    "CON_CHAIR" => "Con Chair",
    "CON_SUITE" => "Hospitality Coordinator",
    "GM_COORDINATOR" => "GM Coordinator",
    "HOTEL_LIAISON" => "Hotel Liaison",
    "IRON_GM" => "Iron GM Coordinator",
    "OPS" => "Operations Coordinator",
    "OPS2" => "Operations Coordinator",
    "OUTREACH" => "Outreach Coordinator",
    "REGISTRAR" => "Registrar",
    "SAFETY_COORDINATOR" => "Safety Coordinator",
    "STAFF_COORDINATOR" => "Volunteer Coordinator",
    "THURSDAY" => "Panel Coordinator",
    "TREASURER" => "Treasurer",
    "VENDOR_LIAISON" => "Vendor Coordinator"
  }

  attr_reader :con, :staff_positions

  def initialize(con, staff_positions)
    @con = con
    @staff_positions = staff_positions
  end

  def import!
    staff_positions.each do |key, data|
      position_name = STAFF_POSITION_NAMES_BY_KEY[key]

      staff_position = con.staff_positions.find_or_initialize_by(name: position_name)
      staff_position.email ||= data['email'].presence
      staff_position.save!

      if data['name'].present?
        person_name_parts = data['name'].split
        first_name, last_name = person_name_parts.first, person_name_parts.last

        user_con_profile = con.user_con_profiles.where(first_name: first_name, last_name: last_name).first
        unless user_con_profile
          # if we can't find them by full name, but there's an unambiguous last name for them, use that person
          last_name_matches = con.user_con_profiles.where(last_name: last_name).to_a
          if last_name_matches.size == 1
            user_con_profile = last_name_matches.first
          end
        end

        if user_con_profile
          staff_position.user_con_profiles << user_con_profile
        else
          logger.warn "Couldn't find user_con_profile for #{data['name']}"
        end
      end
    end
  end

  private

  def logger
    Intercode::Import::Intercode1.logger
  end
end