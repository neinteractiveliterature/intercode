module TeamMemberHelper

  # Build array of users for dropdown list
  def users_array
    ary = Array.new

    # The first entry is an invalid name to prompt the user to select someone
    ary.push(['Select user', -1])

    # Gather the list of names from the database
    users = User.select('id, first_name, last_name')
                .order('last_name ASC, first_name ASC')
    users.each {
      |u|
      name = u.last_name + ", " + u.first_name
      ary.push([name, u.id])
    }
    return ary
  end

end
