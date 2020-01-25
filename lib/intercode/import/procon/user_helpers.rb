module Intercode::Import::Procon::UserHelpers
  def user_con_profile_for_person_id(person_id, convention)
    user = @person_id_map[person_id]
    unless user
      logger.warn "Couldn't find user for person id #{person_id}"
      return nil
    end

    convention.user_con_profiles.find_or_create_by!(user_id: user.id) do |user_con_profile|
      person_row = connection[:people].where(id: person_id).first
      user_con_profile.assign_form_response_attributes(
        first_name: person_row[:firstname] || '',
        last_name: person_row[:lastname] || '',
        birth_date: person_row[:birthdate],
        nickname: person_row[:nickname],
        mobile_phone: person_row[:phone],
        best_call_time: person_row[:best_call_time]
      )
      user_con_profile.first_name = user.email if user_con_profile.name.blank?
    end
  end
end
