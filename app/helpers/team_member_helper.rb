module TeamMemberHelper

  def users_array
    ary = Array.new
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
