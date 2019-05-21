class Types::NavigationBarType < Types::BaseObject
  field :id, ID, null: false
  field :classes, String, null: false
  field :items, [Types::NavigationBarItemType], null: false

  def id
    if user_con_profile
      "user_con_profile_#{user_con_profile.id}_navigation_bar"
    elsif current_user
      "user_#{current_user.id}_navigation_bar"
    else
      'logged_out_navigation_bar'
    end
  end
end
