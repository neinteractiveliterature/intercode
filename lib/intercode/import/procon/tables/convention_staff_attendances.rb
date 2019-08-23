class Intercode::Import::Procon::Tables::ConventionStaffAttendances <
    Intercode::Import::Procon::Table
  include Intercode::Import::Procon::UserHelpers

  def initialize(connection, convention_id_map, person_id_map)
    super connection
    @convention_id_map = convention_id_map
    @person_id_map = person_id_map
  end

  def table_name
    :attendances
  end

  def dataset
    super.where(event_id: @convention_id_map.keys, is_staff: true)
  end

  private

  def build_record(row)
    convention = @convention_id_map[row[:event_id]]
    user_con_profile = user_con_profile_for_person_id(row[:person_id], convention)
    return nil unless user_con_profile

    pos = staff_position(row, convention)
    pos.user_con_profiles << user_con_profile
    pos
  end

  def staff_position(row, convention)
    if row[:staff_position_id]
      staff_position_row = connection[:staff_positions].where(id: row[:staff_position_id]).first
      convention.staff_positions.find_or_create_by!(
        name: staff_position_row[:name]
      ) do |pos|
        pos.email = staff_position_row[:email]
        pos.visible = true
        pos.save!

        grant_all_convention_permissions(pos, convention)
      end
    else
      convention.staff_positions.find_or_create_by!(name: 'Convention staff') do |pos|
        pos.visible = !has_staff_positions?
        pos.save!

        grant_all_convention_permissions(pos, convention)
      end
    end
  end

  def has_staff_positions?
    return @has_staff_positions unless @has_staff_positions.nil?
    @has_staff_positions = connection[:staff_positions]
      .where(id: dataset.map(:staff_position_id))
      .any?
  end

  def grant_all_convention_permissions(staff_position, convention)
    permission_names = Permission.permission_names_for_model_type('Convention')
    Permission.grant(staff_position, convention, *permission_names)
  end
end
