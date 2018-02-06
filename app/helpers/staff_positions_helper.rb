module StaffPositionsHelper
  def staff_position_form(staff_position)
    initial_staff_position = {
      id: staff_position.id,
      email: staff_position.email,
      name: staff_position.name,
      user_con_profile_ids: staff_position.user_con_profile_ids
    }

    react_component(
      'StaffPositionForm',
      baseUrl: staff_positions_url,
      initialStaffPosition: initial_staff_position,
      authenticityToken: graphql_authenticity_token
    )
  end
end
